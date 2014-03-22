//from https://github.com/beersbr/ListJS

var List = (function(list){
	list = {};

	/** @class Creates a node wrapper for a value. To be used with a linked list */
	list.ListNode = function(value)
	{
		this.value = value;
		this.next = null;
		this.prev = null;
	}

	/** @class List Creates a doubly linked list */
	list.List = function()
	{

		/** @type {Number} _length */
		this._length = 0;
		this.head = null;
		this.tail = null;

		Object.defineProperty(this, "length", {
			get: function(){
				return this._length;
			}
		});

		/** @function get the value at list index n
		 *  @param {Number} n the specified index*/
		this.getValue = function(n)
		{

		}


		this.findValue = function(n)
		{

		}

		this.push = function(value)
		{
			if(this.head == null)
			{
				this.head = new list.ListNode(value);
				this.tail = this.head;
			}
			else
			{
				var curNode = this.tail;
				curNode.next = new list.ListNode(value);
				curNode.next.prev = curNode;
				this.tail = curNode.next;
			}

			this._length += 1;

			return true;
		}

		this.removeValue = function(value, compare_fn)
		{
			if(this.head == null)
				return false;

			if(this.head.value == value)
			{
				var node = this.head;
				this.head = this.head.next;
				node = null;
				this._length -= 1;
				return true;
			}

			var curNode = this.head.next;
			while(curNode != null)
			{
				if(compare_fn != undefined)
				{
					if(compare_fn(curNode.value, value))
					{
						curNode.prev.next = curNode.next;
						if(curNode == this.tail)
							this.tail = curNode.prev;
						else
							curNode.next.prev = curNode.prev;

						curNode = null;
						this._length -= 1;
						return true;
					}
				}
				else if(curNode.value == value)
				{
					curNode.prev.next = curNode.next;
					if(curNode == this.tail)
						this.tail = curNode.prev;
					else
						curNode.next.prev = curNode.prev;

					curNode = null;
					this._length -= 1;
					return true;
				}
				curNode = curNode.next;
			}
			return false;
		}

		this.removeNode = function(node)
		{
			if(node == null)
				return false;

			if(node == this.head)
			{
				this.head = this.head.next;
				this.head.prev = null;
				node = null;
				this._length -= 1;
				return true;
			}

			var curNode = this.head.next;
			while(curNode != null)
			{
				if(node == curNode)
				{
					node.prev.next = node.next;
					node = null;
					this._length -= 1;
					return true;
				}
				curNode = curNode.next;
			}

			return false;
		}


		this.eachNode = function(fn)
		{
			var curNode = this.head;
			do
			{
				fn(n);
				curNode = curNode.next;
			}while(curNode != null);

		}

		this.eachValue = function(fn)
		{
			var curNode = this.head;
			while(curNode != null)
			{
				var nextNode = curNode.next;
				fn(curNode.value);

				// this deals with removing nodes while iterating over the list
				curNode = (curNode == null) ? nextNode : curNode.next;
			}

		}

		this.log = function(n)
		{
			var curNode = this.head;

			while(curNode != null)
			{
				console.log(curNode.value);
				curNode = curNode.next;
			}
			return true;
		}
	}

	return list;
})();
