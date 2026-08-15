// Lógica para gerenciar tarefas com localStorage
const form = document.getElementById('task-form')
const titleIn = document.getElementById('title')
const dueIn = document.getElementById('due')
const priorityIn = document.getElementById('priority')
const categoryIn = document.getElementById('category')
const descIn = document.getElementById('description')
const listEl = document.getElementById('task-list')
const searchIn = document.getElementById('search')
const filterEl = document.getElementById('filter')

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]')

function saveTasks(){
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTasks(){
  listEl.innerHTML = ''
  const q = (searchIn.value||'').toLowerCase()
  const filter = filterEl.value
  const todayStr = new Date().toISOString().slice(0,10)
  tasks.filter(t => {
    if(filter==='active') return !t.completed
    if(filter==='completed') return t.completed
    if(filter==='today') return t.due===todayStr
    return true
  }).filter(t => (t.title+t.description+t.category).toLowerCase().includes(q))
  .forEach(t => {
    const li = document.createElement('li')
    li.className = 'task-item ' + (t.completed? 'completed ':'') + 'priority-' + t.priority
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = !!t.completed
    checkbox.addEventListener('change', ()=>{toggleComplete(t.id)})
    const main = document.createElement('div')
    main.className = 'task-main'
    const h = document.createElement('p')
    h.className = 'task-title'
    h.textContent = t.title
    const meta = document.createElement('div')
    meta.className = 'task-meta'
    meta.textContent = `${t.category||'Sem categoria'} • ${t.due||'Sem prazo'} • ${t.priority}`
    const desc = document.createElement('div')
    desc.textContent = t.description || ''
    main.appendChild(h)
    main.appendChild(meta)
    if(t.description) main.appendChild(desc)
    const actions = document.createElement('div')
    actions.className = 'task-actions'
    const editBtn = document.createElement('button')
    editBtn.textContent = 'Editar'
    editBtn.addEventListener('click', ()=> editTask(t.id))
    const delBtn = document.createElement('button')
    delBtn.textContent = 'Excluir'
    delBtn.addEventListener('click', ()=> deleteTask(t.id))
    actions.appendChild(editBtn)
    actions.appendChild(delBtn)
    li.appendChild(checkbox)
    li.appendChild(main)
    li.appendChild(actions)
    listEl.appendChild(li)
  })
}

function addTask(e){
  e.preventDefault()
  const t = {
    id: Date.now(),
    title: titleIn.value.trim(),
    due: dueIn.value || null,
    priority: priorityIn.value,
    category: categoryIn.value.trim(),
    description: descIn.value.trim(),
    completed: false
  }
  if(!t.title) return
  tasks.push(t)
  saveTasks()
  renderTasks()
  form.reset()
}

function toggleComplete(id){
  tasks = tasks.map(t => t.id===id? {...t, completed: !t.completed} : t)
  saveTasks(); renderTasks()
}

function deleteTask(id){
  if(!confirm('Excluir esta tarefa?')) return
  tasks = tasks.filter(t=>t.id!==id)
  saveTasks(); renderTasks()
}

function editTask(id){
  const t = tasks.find(x=>x.id===id)
  if(!t) return
  const newTitle = prompt('Título', t.title)
  if(newTitle===null) return
  t.title = newTitle.trim() || t.title
  const newDue = prompt('Prazo (YYYY-MM-DD)', t.due||'')
  if(newDue!==null) t.due = newDue||null
  const newCategory = prompt('Categoria', t.category||'')
  if(newCategory!==null) t.category = newCategory
  const newDesc = prompt('Descrição', t.description||'')
  if(newDesc!==null) t.description = newDesc
  saveTasks(); renderTasks()
}

form.addEventListener('submit', addTask)
searchIn.addEventListener('input', renderTasks)
filterEl.addEventListener('change', renderTasks)

// Inicializa
renderTasks()
