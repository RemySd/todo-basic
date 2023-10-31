import './styles/app.scss';

require('bootstrap');

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
            }).catch(function (error) {
                console.log('something fail');
            });
    });
});
