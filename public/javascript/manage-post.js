document.addEventListener('DOMContentLoaded', function() {
    const postListButton = document.getElementById('postListButton');
    const postList = document.getElementById('postList');

    const commentListButton = document.getElementById('commentListButton');
    const commentList = document.getElementById('commentList');

    postListButton.addEventListener('click', () => {
        postList.classList.toggle('active');
    });
    commentListButton.addEventListener('click', () => {
        commentList.classList.toggle('active');
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
});