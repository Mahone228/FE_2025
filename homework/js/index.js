const userList = document.getElementById('userList');
const spinner = document.getElementById('spinner');
const editor = document.getElementById('editor');
const nameInput = document.getElementById('fullname');
const emailInput = document.getElementById('contact');
const cancelEditBtn = document.getElementById('cancelEdit');

let currentUserId = null;
let currentUserElement = null;

const toggleSpinner = (visible) => {
  spinner.style.display = visible ? 'block' : 'none';
};

const resetEditor = () => {
  editor.hidden = true;
  nameInput.value = '';
  emailInput.value = '';
  currentUserId = null;
  currentUserElement = null;
};

cancelEditBtn.onclick = resetEditor;

const populateEditor = (user, element) => {
  currentUserId = user.id;
  currentUserElement = element;
  nameInput.value = user.name;
  emailInput.value = user.email;
  editor.hidden = false;
  editor.scrollIntoView({ behavior: 'smooth' });
};

editor.addEventListener('submit', (event) => {
  event.preventDefault();

  const updatedName = nameInput.value.trim();
  const updatedEmail = emailInput.value.trim();

  if (!currentUserId || !updatedName || !updatedEmail) {
return;
}

  toggleSpinner(true);

  fetch(`https://jsonplaceholder.typicode.com/users/${currentUserId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: updatedName, email: updatedEmail })
  })
    .then((res) => {
      if (!res.ok) {
throw new Error('Failed to update');
}
      return res.json();
    })
    .then((data) => {
      currentUserElement.querySelector('.username').textContent = data.name;
      currentUserElement.querySelector('.useremail').textContent = data.email;
    })
    .catch((err) => console.error(err))
    .finally(() => {
      toggleSpinner(false);
      resetEditor();
    });
});

const createUserCard = (user) => {
  const li = document.createElement('li');
  li.id = `user-${user.id}`;

  li.innerHTML = `
    <p class="username">${user.name}</p>
    <p class="useremail">${user.email}</p>
  `;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => populateEditor(user, li);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Delete';
  removeBtn.onclick = () => {
    toggleSpinner(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) {
throw new Error('Deletion failed');
}
        li.remove();
      })
      .catch((err) => console.error(err))
      .finally(() => toggleSpinner(false));
  };

  li.append(editBtn, removeBtn);
  userList.appendChild(li);
};

const fetchUsers = () => {
  toggleSpinner(true);
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((res) => {
      if (!res.ok) {
throw new Error('Network error');
}
      return res.json();
    })
    .then((users) => users.forEach(createUserCard))
    .catch((err) => console.error(err))
    .finally(() => toggleSpinner(false));
};

document.addEventListener('DOMContentLoaded', fetchUsers);
