//whenever the position changes the next in line takes the positio of previous position of Head node
class Node {
  constructor(position) {
    this.position = position;
    this.next = null;
  }
}

class Linked_List {
  constructor() {
    this.Head = null;
  }
  appendLL(data) {
    const newNode = new Node(data);
    if (!this.Head) {
      this.Head = newNode;
    } else {
      newNode.next = this.Head;
      this.Head = newNode;
    }
  }
}

const ll = new Linked_List();
ll.appendLL(1);
ll.appendLL(2);
ll.appendLL(3);
ll.appendLL(4);

//4 --> 3 ---> 2 ---> 1

let current = ll.Head;
//head of linked list
let head=null
while (current.next) {
  current = current.next;
}
head = current

let count = 0
function whenever_change(){
    apply_changes(count)
    count++
}

function apply_changes(newChange){
    console.log("apply called", newChange);
    let current= ll.Head
    while(current){
        if(current.next){
            current.position= current.next.position
        }
        else{
            current.position=newChange
        }
        current = current.next
    }
    console.log(ll.Head);
}

setInterval(() => {
    whenever_change()
}, 3*1000);