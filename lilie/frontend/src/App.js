import './App.css';
import axios from 'axios';
import React from 'react';

class App extends React.Component{
  state = { details: [], }

  componentDidMount(){
    let data;
    axios.get('http://localhost:8000')
    .then(res => {
      data = res.data;
      this.setState({
        details: data
      });
    })
    .catch(err => {
      console.log(err);
    })
  }
  render() {
    return(
      <div>
        <header>Data</header>
        <hr></hr>
        {this.state.details.map((output, id) => (
          <div key={id}>
            <h2>{output.code_col}</h2>
            <p>{output.col_offset}</p>
            <p>{output.filename}</p>
            <p>{output.issue_confidence}</p>
            <p>{output.issue_cwe}</p>
            <p>{output.issue_severity}</p>
            <p>{output.issue_text}</p>
            <p>{output.line_number}</p>
            <p>{output.line_range}</p>
            <p>{output.more_info}</p>
            <p>{output.test_id}</p>
            <p>{output.test_name}</p>
          </div>
        ))}
      </div>
    )
  }
}

export default App;
