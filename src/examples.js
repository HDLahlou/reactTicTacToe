//React: create complex UIs from small and isolated pieces of  code called "components"
//React.Component subclasses

class ShoppingList extends React.Component{
  render(){
    return(
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}


// Example Usage <ShoppingList name= "Mark" />
// Is a react component class or react component type. A component takes in parameters called props/ properties
// returns a hierarchy of views to display via the render method

//Above is translated to in JSX to:
//
// return React.createElement('div', {className: 'shopping-list'},
//   React.createElement('h1', /* ...h1 children ... */),
//   React.createElement('ul' /* ... ul children ...*/)
// );
