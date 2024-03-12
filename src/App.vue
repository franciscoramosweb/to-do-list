<!-- App.vue -->
<template>
  <div class="w-full">
    <div class="w-full mt-28">
      <div class="flex w-full justify-center">
        <div class="flex justify-center w-72 gap-10">
          <div class="flex justify-center">
            <form @submit.prevent="addTodo">
              <div class="flex flex-col gap-5">
                <h1>Add a task:</h1>

                <div class="flex flex-col gap-2">
                  <input
                    class="border-2"
                    type="text"
                    v-model="newTodo.title"
                    placeholder="Title"
                    required
                  />
                  <input
                    class="border-2"
                    type="text"
                    v-model="newTodo.description"
                    placeholder="Description"
                    required
                  />
                </div>
                <button class="border-2 rounded-lg" type="submit">Add</button>
              </div>
            </form>
          </div>

          <div class="flex w-full">
            <form @submit.prevent="importCatFacts">
              <div class="flex flex-col gap-5">
                <label for="catFactsCount">Import a cat fact :)</label>
                <input
                  class="border-2"
                  type="number"
                  v-model.number="catFactsCount"
                />
                <button class="border-2 rounded-lg" type="submit">
                  Import
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="flex w-full justify-center mt-14 overflow-scroll">
        <div class="flex flex-col border-2 rounded-lg w-1/2 justify-center">
          <div class="p-5 w-full justify-center">
            <h2 class="text-center">TO DO LIST</h2>
          </div>
          <div class="flex justify-between w-full p-3">
            <ul class="w-full flex gap-6 flex-col">
              <li
                class="flex gap-6 justify-between border-2 rounded-lg py-5 px-3"
                v-for="todo in todos"
                :key="todo.id"
                :class="{ completed: todo.completed }"
              >
                <div class="flex flex-col w-full">
                  <!-- Render input if todo is being edited -->
                  <div v-if="todo.editing" class="flex flex-col gap-1 w-full">
                    <input
                      v-model="todo.title"
                      type="text"
                      class="border-2 rounded-md"
                    />
                    <input
                      v-model="todo.description"
                      type="text"
                      class="border-2 rounded-md w-full"
                    />
                  </div>
                  <!-- Render title and description if todo is not being edited -->
                  <div v-else>
                    <div
                      class="font-bold"
                      :class="{ 'line-through': todo.completed }"
                    >
                      {{ todo.title }}
                    </div>

                    <div :class="{ 'line-through': todo.completed }">
                      {{ todo.description }}
                    </div>
                  </div>
                </div>

                <div class="flex gap-5">
                  <!-- Toggle edit mode when edit button is clicked -->
                  <button v-if="!todo.editing" @click="editTodo(todo)">
                    <i
                      class="pi pi-pencil"
                      style="color: black"
                      onmouseover="this.style.color='blue'"
                      onmouseout="this.style.color='black'"
                    ></i>
                  </button>
                  <!-- Render save button if todo is being edited -->
                  <button v-else @click="saveTodo(todo)">
                    <i class="pi pi-check" style="color: green"></i>
                  </button>
                  <button @click="deleteTodo(todo.id)">
                    <i
                      class="pi pi-trash"
                      style="color: black"
                      onmouseover="this.style.color='red'"
                      onmouseout="this.style.color='black'"
                    ></i>
                  </button>
                  <button @click="todo.favorite = !todo.favorite">
                    <i
                      style="color: black"
                      onmouseover="this.style.color='yellow'"
                      :class="[
                        'pi pi-star',

                        { 'pi pi-star-fill': todo.favorite },
                      ]"
                      :style="{ color: todo.favorite ? 'yellow' : 'black' }"
                    ></i>
                  </button>

                  <input type="checkbox" v-model="todo.completed" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="favoriteTodos.length"
      class="border-2 absolute top-5 right-5 w-80 p-5 flex flex-col gap-6 rounded-lg"
    >
      <h2>Favorite TO-DOs</h2>
      <ul class="w-full flex gap-6 flex-col">
        <li
          v-for="todo in favoriteTodos"
          :key="todo.id"
          class="flex flex-col gap-1 justify-between border-2 rounded-lg py-3 px-3"
        >
          <div :class="{ 'line-through': todo.completed }" class="font-bold">
            {{ todo.title }}
          </div>
          <div :class="{ 'line-through': todo.completed }">
            {{ todo.description }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "vuex";

// Update Todo interface
interface Todo {
  id: number;
  title: string;
  description: string;
  favorite: boolean;
  completed: boolean;
  editing: boolean; // Add editing field
}

// Update editTodo method
const editTodo = (todo: Todo) => {
  todo.editing = true; // Set editing to true when the edit button is clicked
};

// Update saveTodo method
const saveTodo = (todo: Todo) => {
  todo.editing = false; // Set editing to false when the save button is clicked
  store.commit("editTodo", { id: todo.id, updatedTodo: todo });
};

const newTodo = ref({ title: "", description: "" });
const catFactsCount = ref(0);
const store = useStore();

const todos = computed(() => store.state.todos);
const favoriteTodos = computed<Todo[]>(() => {
  return store.state.todos.filter((todo: Todo) => todo.favorite);
});

const addTodo = () => {
  const newId = todos.value.length + 1;
  const todo: Todo = {
    id: newId,
    ...newTodo.value,
    favorite: false, // Initialize favorite as false
    completed: false,
    editing: false,
  };
  store.commit("addTodo", todo);
  newTodo.value = { title: "", description: "" };
};

const deleteTodo = (id: number) => {
  store.commit("deleteTodo", id);
};

const importCatFacts = () => {
  console.log(catFactsCount.value);
  store.dispatch("fetchCatFacts", catFactsCount.value);
};
</script>
