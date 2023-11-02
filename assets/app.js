import './styles/app.scss';

require('bootstrap');


document.addEventListener("DOMContentLoaded", function () {
    const masonryContainer = document.querySelector('#todo-items');
    const masonry = new Masonry(masonryContainer, {
        percentPosition: true,
        itemSelector: '.col'
    });

    function addRemoveTodoEvent(element) {
        element.addEventListener('click', () => {
            const todoId = element.closest('.todo-item').getAttribute('data-todo-id');
    
            fetch(
                `/app/${todoId}/remove`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((response) => {
                    return response.json();
                }).then(function (data) {
                    element.closest('.todo-item').remove();
                    masonry.reloadItems();
                    masonry.layout();
                })
        });
    }

    function addCheckTodoEvent(element) {
        element.addEventListener('click', () => {
            const todoId = element.closest('.todo-item').getAttribute('data-todo-id');

            fetch(
                `/app/${todoId}/check`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((response) => {
                    return response.json();
                }).then(function (data) {
                    element.closest('.card').classList.remove('text-bg-light');
                    element.closest('.card').classList.add('text-bg-success');
                    element.remove();
                }).catch(function (error) {
                    console.log('something fail');
                });
        });
    }

    const addTodoForm = document.querySelector('#add-todo-form');

    addTodoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch(`/app/add`, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                document.querySelector('#todo-items').insertAdjacentHTML('afterbegin', data.html);

                const newTodo = document.querySelector('#todo-' + data.object.id)

                addRemoveTodoEvent(newTodo.querySelector(".remove-todo"));
                addCheckTodoEvent(newTodo.querySelector(".check-todo"));

                document.querySelector('#add-todo-form').reset();
                masonry.reloadItems();
                masonry.layout();
            })
            .catch(error => {
                console.error(error);
            });
    });

    const removeButtons = document.querySelectorAll('.remove-todo');

    removeButtons.forEach((button) => {
        addRemoveTodoEvent(button);
    });

    const checkButtons = document.querySelectorAll('.check-todo');

    checkButtons.forEach((button) => {
        addCheckTodoEvent(button);
    });
});
