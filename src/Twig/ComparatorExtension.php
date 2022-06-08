<?php

declare(strict_types=1);

namespace Asdoria\SyliusProductComparatorPlugin\Twig;

use Twig\Extension\AbstractExtension;
use Sylius\Component\Resource\Repository\RepositoryInterface;
use Twig\TwigFunction;
use Doctrine\Common\Collections\ArrayCollection;
use Sylius\Component\Product\Model\ProductAttributeInterface;
/**
 * Class ComparatorExtension
 *
 * @author Philippe Vesin <pve.asdoria@gmail.com>
 */
class ComparatorExtension extends AbstractExtension
{

    protected array $availableAttributes = [];
    protected RepositoryInterface $attributeRepository;

    /**
     * @param RepositoryInterface $attributeRepository
     * @param array               $availableAttributes
     */
    public function __construct(RepositoryInterface $attributeRepository , array $availableAttributes)
    {
        $this->availableAttributes = $availableAttributes;
        $this->attributeRepository = $attributeRepository;
    }

    /**
     * @return TwigFunction[]
     */
    public function getFunctions()
    {
        return [
            new TwigFunction('availableAttributesForCompare', [$this, 'getAvailableAttributes']),
        ];
    }

    public function getAvailableAttributes(): ArrayCollection{
        $availableAttributes = new ArrayCollection();
        foreach ($this->availableAttributes as $code) {
            $attr = $this->attributeRepository->findOneByCode($code);
            if ($attr instanceof ProductAttributeInterface) {
                $availableAttributes->add($attr->getId());
            }
        }
        return $availableAttributes;
    }
}
