<?php
declare(strict_types=1);

namespace Asdoria\SyliusProductComparatorPlugin\Controller\Shop;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

class ComparatorController
{
    /** @var Environment */
    private Environment $templatingEngine;

    public function __construct(Environment $templatingEngine)
    {
        $this->templatingEngine = $templatingEngine;
    }

    public function indexAction(Request $request): Response
    {
        return new Response($this->templatingEngine->render('@AsdoriaSyliusProductComparatorPlugin/Shop/Comparator/index.html.twig'));
    }
}
