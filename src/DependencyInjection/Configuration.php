<?php

declare(strict_types=1);

namespace Asdoria\SyliusProductComparatorPlugin\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

final class Configuration implements ConfigurationInterface
{
    const CONFIG_AVAILABLE_ATTRIBUTES = 'available_attributes';
    /**
     * @psalm-suppress UnusedVariable
     */
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('asdoria_product_comparator');
        $treeBuilder->getRootNode()
            ->children()
                ->arrayNode(self::CONFIG_AVAILABLE_ATTRIBUTES)
                    ->ignoreExtraKeys()
                    ->addDefaultChildrenIfNoneSet()
                        ->prototype('scalar')
                        ->defaultValue('t_shirt_brand')
                        ->defaultValue('t_shirt_material')
                        ->defaultValue('length')
                    ->end()
                ->end()
            ->end();


        return $treeBuilder;
    }
}
