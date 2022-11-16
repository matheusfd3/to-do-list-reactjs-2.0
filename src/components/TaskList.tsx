import { ChangeEvent, FormEvent, useState } from 'react';
import { ClipboardText, PlusCircle, Trash } from 'phosphor-react';
import styles from './TaskList.module.css';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  function handleNewTaskChanged(event: ChangeEvent<HTMLInputElement>) {
    setNewTaskTitle(event.target.value);
  }

  function handleCreateNewTask(event: FormEvent) {
    event.preventDefault();

    const newTask: Task = {
      id: Math.random(),
      title: newTaskTitle,
      isCompleted: false,
    }

    setTasks(oldState => [...oldState, newTask]);

    setNewTaskTitle('');
  }

  function handleToggleTaskCompletion(idTask: number) {
    const newTask = tasks.map(task => {
      if (task.id === idTask) {
        return {
          ...task,
          isCompleted: !task.isCompleted
        }
      }
      return task;
    });

    setTasks(newTask);
  }

  function handleRemoveTask(idTask: number) {
    const newTask = tasks.filter(task => task.id !== idTask);

    setTasks(newTask);
  }

  const totalTasksCreated = tasks.length;
  const totalTasksCompleted = tasks.reduce((total, task) => {
    if (task.isCompleted) {
      return total + 1;
    }
    return total;
  }, 0);
  const isEmptyTask = !totalTasksCreated;

  return(
    <section className={styles.container}>
      <form onSubmit={handleCreateNewTask}>
        <input 
          type="text"
          placeholder='Adicione uma nova tarefa'
          value={newTaskTitle}
          onChange={handleNewTaskChanged}
          required
        />
        <button type="submit">
          Criar
          <PlusCircle size={16} />
        </button>
      </form>

      <main className={styles.taskListContainer}>
        <header>
          <strong className={styles.createdTasksTitle}>Tarefas criadas <span>{totalTasksCreated}</span></strong>
          <strong className={styles.completedTasksTitle}>Concluídas <span>{totalTasksCreated > 0 ? `${totalTasksCompleted} de ${totalTasksCreated}` : totalTasksCreated}</span></strong>
        </header>
        {
          !isEmptyTask ? 
            <ul className={styles.taskList}>
              {tasks.map(task => (
                <li key={task.id}>
                  <div className={task.isCompleted ? styles.completedTask : ''}>
                    <label className={styles.checkboxContainer}>
                      <input 
                        type="checkbox"
                        checked={task.isCompleted}
                        onClick={() => handleToggleTaskCompletion(task.id)}
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <p className={task.isCompleted ? styles.completed : ''}>{task.title}</p>
                  </div>
                  <button onClick={() => handleRemoveTask(task.id)}>
                    <Trash size={16} />
                  </button>
                </li>
              ))}
            </ul>
          :
            <div className={styles.emptyTaskWarning}>
              <ClipboardText size={56} />
              <strong>Você ainda não tem tarefas cadastradas</strong>
              <span>Crie tarefas e organize seus itens a fazer</span>
            </div>
        }
      </main>
    </section>
  );
}