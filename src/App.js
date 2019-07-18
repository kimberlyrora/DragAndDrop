import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

// fake data generator
// la longitud depende de count, map para la creación de dat del array
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  // result sera el array generado a partir de la lista pasada como argumento
    const result = Array.from(list);
    // el array result se dividira de la posicion inicial a 1 y se hace destructuracion para que sea tomado como index
    const [removed] = result.splice(startIndex, 1);
// se divide result desde la posicion final
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
// source = segunda lista inicial antes de mover item
// destination = primera lista inicial antes de mover item
//  droppableSource.index = indica la posicion inicial que tenia antes de ser movida
//  droppableSource.Id = indica la lista inicial a ala que pertenecia antes de ser movida
//  droppableDestination.Id = indica la lista de destino a ala que pertenecia antes de ser movida
//  droppableSource.index = indica la posicion final 

const move = (source, destination, droppableSource, droppableDestination) => {
// genera array a partir de source
  const sourceClone = Array.from(source);
  // genera array a partir de destination
    const destClone = Array.from(destination);

    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables    
    ...draggableStyle
    
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});


class App extends Component {
  state = {
    // lista de los items de los que se va a elegir
    items: getItems(10),
    // lista de los items elegidos
    selected: getItems(5, 10)
};

/**
 * A semi-generic way to handle multiple lists. Matches
 * the IDs of the droppable container to the names of the
 * source arrays stored in the state.
 */
id2List = {
    droppable: 'items',
    droppable2: 'selected'
};

getList = id => this.state[this.id2List[id]];

onDragEnd = result => {
  const { source, destination } = result;

  // dropped outside the list
  if (!destination) {
      return;
  }

  if (source.droppableId === destination.droppableId) {    
      const items = reorder(
          this.getList(source.droppableId),
          source.index,
          destination.index
      );

      let state = { items };

      if (source.droppableId === 'droppable2') {
          state = { selected: items };
      }

      this.setState(state);
  } else {

      const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
      );

      this.setState({
          items: result.droppable,
          selected: result.droppable2
      });
  }
};


// Normally you would want to split things out into separate components.
// But in this example everything is just done in one place for simplicity
render() {
    return (
        <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}>
                        {this.state.items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        {item.content}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}>
                        {this.state.selected.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        {item.content}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
}

export default App;
