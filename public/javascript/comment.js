async function commentFormHandler(event) {
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    //  we wrapped the entire request in an 'if' statement to prevent users from submitting empty strings
    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            // included two properties on the 'body'
            // the post route also has a parameter for user_id, but we get that from the session in the post, so we don't have to send that here.
            body: JSON.stringify({
                post_id,
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        }
        else {
            alert(response.statusText);
        }
        
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);