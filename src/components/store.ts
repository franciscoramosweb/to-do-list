// store.ts

import { createStore } from "vuex";

interface Todo {
  id: number;
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

    importCatFacts(state, catFacts: Todo[]) {
      state.todos.push(...catFacts);
    },
  },

  actions: {
    async fetchCatFacts({ commit },catFactsCount) {
      console.log(catFactsCount);
      const response = await fetch(
        `https://cat-fact.herokuapp.com/facts/random?amount=${catFactsCount}`
      );
      const data = await response.json();
      const catFacts: Todo[] = data.map((fact: any, index: number) => ({
        id: index + 1,
        title: `Cat Fact ${index + 1}`,
        description: fact.text,
      }));
      commit("importCatFacts", catFacts);
    },
  },
});
