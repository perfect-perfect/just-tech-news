
// I cannot delete posts taht have comments or upvotes ???
async function deleteFormHandler(event) {
    event.preventDefault();

    // capture the id of the post
    // look at the url string on the edit page localhost.3001/dashboard/edit/3
    //  - split it into an array based on the '/' character
    //  - and then grab the list item of the array using '.length -1'
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    // the delete request doesn't need to include anything on the 'body' so its simpler here
    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    }
    else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);