<?php

declare(strict_types=1);

namespace Asdoria\SyliusProductComparatorPlugin\DependencyInjection;

use Sylius\Bundle\CoreBundle\DependencyInjection\PrependDoctrineMigrationsTrait;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Asdoria\SyliusProductComparatorPlugin\DependencyInjection\Configuration;

final class AsdoriaSyliusProductComparatorExtension extends Extension implements ExtensionInterface
{
    /**
     * @param array            $configs
     * @param ContainerBuilder $container
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration       = new Configuration();
        $config              = $this->processConfiguration($configuration, $configs);
        $availableAttributes = $config[Configuration::CONFIG_AVAILABLE_ATTRIBUTES] ?? [];
        $loader              = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $container->setParameter('asdoria_sylius_product_comparator.available_attributes', $availableAttributes);
        $loader->load('services.yaml');
    }
}
