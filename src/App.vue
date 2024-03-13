<!-- App.vue -->
<template>
  <body>
    <main class="min-h-screen bg-gray-600">
      <div class="w-full">
        <div class="w-full pt-28">
          <div class="flex w-full justify-center text-white">
            <div
              class="flex justify-center min-w-72 rounded-lg p-5 gap-10 border-2"
            >
              <div class="flex justify-center">
                <form @submit.prevent="addTodo">
                  <div class="flex flex-col gap-5">
                    <h1>Add a task:</h1>

                    <div class="flex flex-col gap-2">
                      <input
                        class="border-2 rounded-lg pl-2 text-gray-800"
                        type="text"
                        maxlength="50"
                        v-model="newTodo.title"
                        placeholder="Title"
                        required
                      />
                      <input
                        class="border-2 rounded-lg pl-2 text-gray-800"
                        type="text"
                        v-model="newTodo.description"
                        placeholder="Description"
                        required
                      />
                    </div>
                    <button class="border-2 rounded-lg" type="submit">
                      Add
                    </button>
                  </div>
                </form>
              </div>

              <div class="flex w-full">
                <form @submit.prevent="importCatFacts">
                  <div class="flex flex-col gap-5">
                    <label for="catFactsCount">Import a cat fact :)</label>
                    <input
                      class="border-2 rounded-lg pl-2 text-gray-800"
                      type="number"
                      :max="10"
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

          <div class="flex w-full justify-center py-14 overflow-scroll">
            <div class="flex flex-col border-2 rounded-lg w-1/2 justify-center">
              <div class=" px-16 py-9 w-full justify-between flex">
                <h2 class="text-center text-white text-3xl font-bold">
                  to do list:
                </h2>
                <button v-if="todos.length > 0" class="border-2 rounded-lg px-4 py-2 text-white bg-red-500 hover:bg-red-600" @click="clearAllTodos">Clear All</button>
              </div>
              <div class="flex justify-between w-full p-3">
                <ul class=" w-full flex gap-6 flex-col">
                  <li
                    class="flex gap-6 justify-between border-2 rounded-lg py-5 px-3 duration-500 transition-all bg-gray-300 w-full"
                    v-for="todo in todos"
                    :key="todo.id"
                    :class="{ completed: todo.completed }"
                  >
                    <div class="flex flex-col w-full">
                      <!-- Render input if todo is being edited -->
                      <div
                        v-if="todo.editing"
                        class="flex flex-col gap-1 w-full"
                      >
                        <input
                          maxlength="50"
                          placeholder="Title"
                          v-model="todo.title"
                          type="text"
                          class="border-2 rounded-md font-bold"
                          required
                        />
                        <input
                          placeholder="Description"
                          v-model="todo.description"
                          type="text"
                          class="border-2 rounded-md"
                          required
                        />
                      </div>
                      <!-- Render title and description if todo is not being edited -->
                      <div v-else class=" w-full">
                        <div
                          class="font-bold w-full"
                          :class="{ 'line-through': todo.completed }"
                        >
                          {{ todo.title }}
                        </div>

                        <div :class="{ 'line-through': todo.completed }" class="w-full max-w-[38rem] break-words">
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
                          onmousehover="this.style.color='yellow'"
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
          <h2 class="text-white font-bold">favorite to dos:</h2>
          <ul class="w-full flex gap-6 flex-col">
            <li
              v-for="todo in favoriteTodos"
              :key="todo.id"
              class="flex flex-col gap-1 justify-between border-2 rounded-lg py-3 px-3 bg-gray-300 w-full max-w-[18rem] break-words"
            >
              <div
                :class="{ 'line-through': todo.completed }"
                class="font-bold"
              >
                {{ todo.title }}
              </div>
              <div :class="{ 'line-through': todo.completed }" class="w-full max-w-[10rem] break-words">
                {{ todo.description }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </body>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { generateGUID } from "./components/store.ts"; // Import generateGUID function


// Update Todo interface
interface Todo {
  id: string;
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
  
  const newId = todos.value.length > 0 ? todos.value[todos.value.length - 1].id + 1 : 1;
  const todo: Todo = {
    id: generateGUID(), // Generate GUID here
    ...newTodo.value,
    favorite: false,
    completed: false,
    editing: false,
  };
  // Insert the new todo at the beginning of the array
  store.state.todos.unshift(todo);
  newTodo.value = { title: "", description: "" };
};

const deleteTodo = (id: number) => {
  store.commit("deleteTodo", id);
};

// Method to clear all todos
const clearAllTodos = () => {
  store.commit("clearAllTodos");
};

const importCatFacts = () => {
  console.log(catFactsCount.value);
  store.dispatch("fetchCatFacts", catFactsCount.value);
};
</script>
