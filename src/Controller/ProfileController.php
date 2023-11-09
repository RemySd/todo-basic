<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProfileController extends AbstractController
{
    #[Route('/profile', name: 'app_profile')]
    public function index(): Response
    {
        return $this->render('profile/index.html.twig');
    }

    #[Route('/switch-fr', name: 'app_switch_fr')]
    public function switchLocaleToFr(Request $request): Response
    {
        $request->getSession()->set('_locale', 'fr');

        return new JsonResponse();
    }

    #[Route('/switch-en', name: 'app_switch_en')]
    public function switchLocaleToEn(Request $request): Response
    {
        $request->getSession()->set('_locale', 'en');

        return new JsonResponse();
    }
}
