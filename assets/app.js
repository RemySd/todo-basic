import './styles/app.scss';

require('bootstrap');

document.addEventListener("DOMContentLoaded", function () {
    const masonryContainer = document.querySelector('#todo-items');
    const masonry = new Masonry(masonryContainer, {
        percentPosition: true,
        itemSelector: '.col'
    });

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
        button.addEventListener('click', () => {
            const todoId = button.closest('.todo-item').getAttribute('data-todo-id');

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
                    button.closest('.todo-item').remove();
                    masonry.reloadItems();
                    masonry.layout();
                }).catch(function (error) {
                    console.log('something fail');
                });
        });
    });

    const checkButtons = document.querySelectorAll('.check-todo');

    checkButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const todoId = button.closest('.todo-item').getAttribute('data-todo-id');

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
                    button.closest('.card').classList.remove('text-bg-light');
                    button.closest('.card').classList.add('text-bg-success');
                    button.remove();
                }).catch(function (error) {
                    console.log('something fail');
                });
        });
    });


});



