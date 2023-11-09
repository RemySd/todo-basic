<?php

namespace App\Controller;

use App\Entity\TodoItem;
use App\Form\TodoItemFormType;
use App\Repository\TodoItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class TodoController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function homepage(Request $request): Response
    {
        return $this->render('todo/home.html.twig');
    }

    #[Route('/app', name: 'app_todo')]
    public function index(TodoItemRepository $todoItemRepository, Request $request, EntityManagerInterface $entityManager): Response
    {
        $todoItem = new TodoItem();
        $todoItemForm = $this->createForm(TodoItemFormType::class, $todoItem);

        $todoItems = $todoItemRepository->findBy(['user' => $this->getUser()]);

        return $this->render('todo/index.html.twig', [
            'todoItems' => $todoItems,
            'todoForm' => $todoItemForm
        ]);
    }

    #[Route('/app/add', name: 'app_todo_add', methods: ["POST"])]
    public function addTodo(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $todoItem = new TodoItem();
        $todoItemForm = $this->createForm(TodoItemFormType::class, $todoItem);

        $todoItemForm->handleRequest($request);
        if ($todoItemForm->isSubmitted() && $todoItemForm->isValid()) {
            $todoItem->setUser($this->getUser());

            $entityManager->persist($todoItem);
            $entityManager->flush();

            return $this->json([
                'object' => $todoItem, 
                'html' => $this->render('todo/todo.html.twig', ['todoItem' => $todoItem])->getContent()
            ]);
        }

        return $this->json([]);
    }

    #[Route('/app/{todoItem}/remove', name: 'app_todo_remove', methods: ["POST"])]
    public function removeTodo(TodoItem $todoItem, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($todoItem);
        $entityManager->flush();

        return $this->json([]);
    }

    #[Route('/app/{todoItem}/check', name: 'app_todo_check', methods: ["POST"])]
    public function checkTodo(TodoItem $todoItem, EntityManagerInterface $entityManager): JsonResponse
    {
        $todoItem->setIsValided(true);
        $entityManager->flush();

        return $this->json([]);
    }
}
