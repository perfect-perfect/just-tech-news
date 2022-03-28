async function upvoteClickHandler(event) {
    event.preventDefault();

    // look at the URL on the single-post page.
    //  - it includes the id!
    //  - you can take a url string like 'http://localhost:3001/post/1, 
    //  - split it into an array based on the '/' character 
    //  - and then grab the last item of the array, using '.length -1' which in this case is the post id
    //      - the result would be a single object, so we manually put it in an array
    // - it seems like you split it first to create the array, but you still have to include all the window.location info in order to attach the '.length -1' in order to get the last item of the array
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
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
};

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);