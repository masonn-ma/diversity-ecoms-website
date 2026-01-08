document.addEventListener('DOMContentLoaded', function() {
    const postListButton = document.getElementById('postListButton');
    const postList = document.getElementById('postList');

    const commentListButton = document.getElementById('commentListButton');
    const commentList = document.getElementById('commentList');

    const userListButton = document.getElementById('userListButton');
    const userList = document.getElementById('userList');
    const viewDetails = document.querySelectorAll('.viewDetails');

    postListButton.addEventListener('click', () => {
        postList.classList.toggle('active');
    });

    commentListButton.addEventListener('click', () => {
        commentList.classList.toggle('active');
    });

    userListButton.addEventListener('click', () => {
        userList.classList.toggle('active');
    });

    postListButton.addEventListener('keydown', () => {
        if (event.key === 'Enter') {
            postList.classList.toggle('active');
        }
    });
    
    commentListButton.addEventListener('keydown', () => {
        if (event.key === 'Enter') {
            commentList.classList.toggle('active');
        }
    });

    userListButton.addEventListener('keydown', () => {
        if (event.key === 'Enter') {
            userList.classList.toggle('active');
        }
    });

    viewDetails.forEach(function(button) {
        button.addEventListener('click', function(event) {
            const target = event.target;
            const detailsDiv = target.parentElement.parentElement.nextElementSibling;

            detailsDiv.classList.toggle('active');
        });
    });
});