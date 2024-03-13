// store.ts

import { createStore } from "vuex";

interface Todo {
  id: string;
  title: string;
  description: string;
}

interface State {
  todos: Todo[];
  favoriteTodos: Todo[];
  catFactsCount: number;
}

export default createStore<State>({
  state() {
    return {
      todos: [],
      favoriteTodos: [],
      catFactsCount: 0,
    };
  },
  mutations: {
    addTodo(state, todo: Todo) {
      state.todos.push(todo);
    },
    editTodo(state, { id, updatedTodo }: { id: number; updatedTodo: Todo }) {
      const index = state.todos.findIndex((todo) => todo.id === id);
      state.todos.splice(index, 1, updatedTodo);
    },
    deleteTodo(state, id: number) {
      state.todos = state.todos.filter((todo) => todo.id !== id);
    },

    clearAllTodos(state) {
      state.todos = [];
    },
    importCatFacts(state, catFacts: Todo[]) {
      state.todos.push(...catFacts);
    },
  },

  actions: {
    async fetchCatFacts({ commit }, catFactsCount) {
      console.log(catFactsCount);
      const response = await fetch(
        `https://cat-fact.herokuapp.com/facts/random?amount=${catFactsCount}`
      );
      const data = await response.json();
  
      let catFacts: Todo[] = [];
  
      if (Array.isArray(data)) {
        catFacts = data.map((fact: any, index: number) => ({
          id: generateGUID(),
          title: `Cat Fact ${index + 1}`,
          description: fact.text,
        }));
      } else {
        catFacts.push({
          id: generateGUID(),
          title: "Cat Fact 1",
          description: data.text,
        });
      }
  
      commit("importCatFacts", catFacts);
    },
  },
  

  
});

export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}