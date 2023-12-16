// if (!document.cookie) {
//     window.location.href = '/login.html';
// } else {
//     const logoutButton = document.getElementById('logoutButton');
//     logoutButton.addEventListener('click', () => {
//         document.cookie = 'user_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//         window.location.href = '/login.html';
//     });
// }



function logout() {
    fetch('/user_logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: {}
      })
      .then(response => {
            window.location.href = '/index.html';
      })
      .catch(error => console.error('Error:', error));
}