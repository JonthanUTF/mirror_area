const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');
const countEl = document.getElementById('count');

let todos = [];

function render() {
  list.innerHTML = '';
  todos.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t;

    const btn = document.createElement('button');
    btn.className = 'remove';
    btn.innerHTML = '×';
    btn.title = 'Remove';
    btn.addEventListener('click', () => {
      todos.splice(i, 1);
      render();
    });

    li.appendChild(btn);
    list.appendChild(li);
  });
  countEl.textContent = todos.length;
}

function addTodo() {
  const v = input.value.trim();
  if (!v) return;
  todos.push(v);
  input.value = '';
  render();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', e => e.key === 'Enter' && addTodo());

render();