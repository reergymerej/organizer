var org = {
	init: function () {
		org.taskManager = new org.TaskManager();
		org.id = Date.now();
	},
	id: undefined,
	taskManager: undefined,
	TYPES: ['todo', 'inprogress', 'waiting', 'done'],
	getTaskEl: function () {
		var el = $('<li/>').addClass('task');
		el.append($('<span/>').addClass('label'));
		el.append(getRemoveEl());
		return el;

		function getRemoveEl() {
			var el = $('<span/>').addClass('remove').html('X');
			el.click(function () {
				console.log('hello');
			});
			return el;
		}
	},
	TaskManager: function () {
		// load tasks
		var i = 0, max, t;

		this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];

		for (i = 0, max = this.tasks.length; i < max; i++) {
			t = this.tasks[i];
			this.tasks[i] = new org.Task(t);
		}
	},
	Task: function (config) {
		this.description = config.description;
		this.type = config.type;
		this.id = parseInt(config.id, 10) || org.id++;
		this.created = parseInt(config.created, 10) || Date.now();
		this.started = parseInt(config.started, 10) || undefined;
		this.finished = parseInt(config.finished, 10) || undefined;
		this.createView();
	}
};

org.TaskManager.prototype.newTask = function (description, type) {
	var task;
	if (org.TYPES.indexOf(type) === -1) {
		console.error('unsupported type');
		return;
	}

	task = new org.Task({
		description: description,
		type: type
	});
	this.tasks.push(task);
	this.save();
	return task;
};

org.TaskManager.prototype.save = function () {
	localStorage.removeItem('tasks');
	localStorage.setItem('tasks', JSON.stringify(this.tasks));
};

org.TaskManager.prototype.remove = function (task) {
	var index = this.tasks.indexOf(task);
	if (index !== -1) {
		this.tasks.splice(index, 1);
		this.save();
	}
};

org.Task.prototype.createView = function () {
	var el = org.getTaskEl();
	el.data('task', this);
	$('.label', el).html(this.description);
	$('#' + this.type).append(el);
};

org.Task.prototype.save = function () {
	org.taskManager.save();
};

org.Task.prototype.remove = function () {
	org.taskManager.remove(this);
};

org.Task.prototype.setType = function (type) {
	if (type === this.type || org.TYPES.indexOf(type) === -1) {
		return;
	}

	this.type = type;
	this.save();
};

$(function () {
	org.init();
	$('.taskHolder').delegate(function (event) {
		var me = this;

		if (event.target === this) {
			// add a new event
			(function () {
				var id = me.id,
					el = $(me),
					input = $('<input/>', {
						type: 'text'
					}),
					div = $('<div/>', {
						class: 'task'
					});

				div.append(input);
				el.append(div);
				input.focus();
				input.blur(function () {
					var description = $.trim($(this).val());
					if (description) {
						org.taskManager.newTask(description, id);
						$(this).remove();
					}
					div.remove();
				});

			}());
		} else {
			console.log('edit event');
		}

		
	}, 'click');

});