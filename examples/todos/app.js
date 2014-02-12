jQuery(function($){

    var list = new TodoList(),
        view = new TodoListView(list);

    list.fetch();
});
