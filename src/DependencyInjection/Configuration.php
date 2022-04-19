<?php

declare(strict_types=1);

namespace Asdoria\SyliusProductComparatorPlugin\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

final class Configuration implements ConfigurationInterface
{
    /**
     * @psalm-suppress UnusedVariable
     */
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('asdoria_product_comparator');
        $rootNode = $treeBuilder->getRootNode();

        return $treeBuilder;
    }
}
