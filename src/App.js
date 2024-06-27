import React, { useState } from 'react';
import './App.css';  // 引入外部CSS文件

const App = () => {
  const [apiName, setApiName] = useState('');
  const [inputFields, setInputFields] = useState([{ field: '', type: '' }]);
  const [outputFields, setOutputFields] = useState([{ field: '', type: '' }]);
  const [httpMethod, setHttpMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [generatedApiFile, setGeneratedApiFile] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleInputFieldChange = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleOutputFieldChange = (index, event) => {
    const values = [...outputFields];
    values[index][event.target.name] = event.target.value;
    setOutputFields(values);
  };

  const addInputField = () => {
    setInputFields([...inputFields, { field: '', type: '' }]);
  };

  const addOutputField = () => {
    setOutputFields([...outputFields, { field: '', type: '' }]);
  };

  const generateApiFileContent = () => {
    const inputTypeDefinition = inputFields.map(f => `${f.field}: ${f.type}`).join('\n    ');
    const outputTypeDefinition = outputFields.map(f => `${f.field}: ${f.type}`).join('\n    ');

    return `
type (
  ${apiName}Req {
    ${inputTypeDefinition}
  }
  ${apiName}Resp {
    ${outputTypeDefinition}
  }
)

service ${apiName} {
  @handler ${apiName}Handler
  ${httpMethod.toLowerCase()} /${endpoint} ( ${apiName}Req ) returns ( ${apiName}Resp )
}
    `;
  };

  const handleGenerateClick = () => {
    const apiFileContent = generateApiFileContent();
    setGeneratedApiFile(apiFileContent);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(generatedApiFile)
        .then(() => {
          setCopySuccess('Copied!');
          setTimeout(() => setCopySuccess(''), 2000);
        })
        .catch(err => {
          setCopySuccess('Failed to copy!');
        });
  };

  return (
      <div className="App">
        <h1>Go-Zero API File Generator</h1>
        <form className="form-container">
          <div className="form-group">
            <label>API Name:</label>
            <input
                type="text"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                className="input-field"
            />
          </div>
          <div className="form-group">
            <label>HTTP Method:</label>
            <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value)}
                className="input-field"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div className="form-group">
            <label>Endpoint:</label>
            <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Input Fields:</label>
            {inputFields.map((inputField, index) => (
                <div key={index} className="nested-form-group">
                  <input
                      name="field"
                      placeholder="Field Name"
                      value={inputField.field}
                      onChange={e => handleInputFieldChange(index, e)}
                      className="input-field"
                  />
                  <input
                      name="type"
                      placeholder="Field Type"
                      value={inputField.type}
                      onChange={e => handleInputFieldChange(index, e)}
                      className="input-field"
                  />
                </div>
            ))}
            <button type="button" onClick={addInputField} className="btn">Add Input Field</button>
          </div>
          <div className="form-group">
            <label>Output Fields:</label>
            {outputFields.map((outputField, index) => (
                <div key={index} className="nested-form-group">
                  <input
                      name="field"
                      placeholder="Field Name"
                      value={outputField.field}
                      onChange={e => handleOutputFieldChange(index, e)}
                      className="input-field"
                  />
                  <input
                      name="type"
                      placeholder="Field Type"
                      value={outputField.type}
                      onChange={e => handleOutputFieldChange(index, e)}
                      className="input-field"
                  />
                </div>
            ))}
            <button type="button" onClick={addOutputField} className="btn">Add Output Field</button>
          </div>
          <button type="button" onClick={handleGenerateClick} className="btn btn-primary">
            Generate API File
          </button>
        </form>
        <h2>Generated API File Content:</h2>
        <div className="api-file-container">
          <pre className="api-file">{generatedApiFile}</pre>
          {generatedApiFile && <button onClick={handleCopyClick} className="btn btn-copy">Copy</button>}
          {copySuccess && <div className="copy-success">{copySuccess}</div>}
        </div>
      </div>
  );
}

export default App;
