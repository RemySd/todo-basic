<?php

namespace App\EventSubscriber;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Translation\DataCollectorTranslator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LocaleSubscriber implements EventSubscriberInterface
{
    private DataCollectorTranslator $translator;

    /**
     * @required
     */
    public function setTranslator(TranslatorInterface $translator): void
    {
        $this->translator = $translator;
        dump($this->translator);
    }
    
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        if (!$request->hasPreviousSession()) {
            return;
        }

        // try to see if the locale has been set as a _locale routing parameter
        if ($locale = $request->attributes->get('_locale')) {
            $request->getSession()->set('_locale', $locale);
        } else {
            // if no explicit locale has been set on this request, use one from the session
            $request->setLocale($request->getSession()->get('_locale', 'en'));
            $this->translator->setlocale($request->getSession()->get('_locale', 'en'));
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }
}
