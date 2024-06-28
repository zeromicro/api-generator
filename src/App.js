import React, { useState } from 'react';
import './App.css';  // 引入外部CSS文件

const App = () => {
  const [serviceName, setServiceName] = useState('');
  const [requests, setRequests] = useState([
    { httpMethod: 'GET', endpoint: '', requestTypeName: '', responseTypeName: '', inputFields: [{ field: '', type: '' }], outputFields: [{ field: '', type: '' }] }
  ]);
  const [generatedApiFile, setGeneratedApiFile] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleServiceNameChange = (e) => {
    setServiceName(e.target.value);
  };

  const handleRequestChange = (index, name, value) => {
    const newRequests = [...requests];
    newRequests[index][name] = value;
    setRequests(newRequests);
  };

  const handleFieldChange = (reqIndex, type, fieldIndex, event) => {
    const newRequests = [...requests];
    newRequests[reqIndex][type][fieldIndex][event.target.name] = event.target.value;
    setRequests(newRequests);
  };

  const addField = (reqIndex, type) => {
    const newRequests = [...requests];
    newRequests[reqIndex][type].push({ field: '', type: '' });
    setRequests(newRequests);
  };

  const removeField = (reqIndex, type, fieldIndex) => {
    const newRequests = [...requests];
    newRequests[reqIndex][type].splice(fieldIndex, 1);
    setRequests(newRequests);
  };

  const addRequest = () => {
    setRequests([...requests, { httpMethod: 'GET', endpoint: '', requestTypeName: '', responseTypeName: '', inputFields: [{ field: '', type: '' }], outputFields: [{ field: '', type: '' }] }]);
  };

  const removeRequest = (index) => {
    const newRequests = [...requests];
    newRequests.splice(index, 1);
    setRequests(newRequests);
  };

  const generateApiFileContent = () => {
    const typeDefinitions = requests.map((req) => {
      const inputTypeDefinition = req.inputFields.map(f => `    ${f.field}: ${f.type}`).join('\n');
      const outputTypeDefinition = req.outputFields.map(f => `    ${f.field}: ${f.type}`).join('\n');

      return `
type (
  ${req.requestTypeName} {
${inputTypeDefinition}
  }
  ${req.responseTypeName} {
${outputTypeDefinition}
  }
)`;
    }).join('\n');

    const serviceDefinitions = requests.map((req, idx) => {
      return `
  @handler ${serviceName}Handler${idx}
  ${req.httpMethod.toLowerCase()} ${req.endpoint} (${req.requestTypeName}) returns (${req.responseTypeName})`;
    }).join('\n');

    return `${typeDefinitions}

service ${serviceName} {${serviceDefinitions}
}`;
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
        <h1>go-zero API File Generator</h1>
        <div className="container">
          <form className="form-container">
            <div className="form-group">
              <label>Service Name:</label>
              <input
                  type="text"
                  value={serviceName}
                  onChange={handleServiceNameChange}
                  className="input-field"
              />
            </div>
            {requests.map((req, reqIdx) => (
                <div key={reqIdx} className="request-group">
                  <h3>Request {reqIdx + 1}</h3>
                  <div className="form-group">
                    <label>HTTP Method:</label>
                    <select
                        value={req.httpMethod}
                        onChange={(e) => handleRequestChange(reqIdx, 'httpMethod', e.target.value)}
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
                        value={req.endpoint}
                        onChange={(e) => handleRequestChange(reqIdx, 'endpoint', e.target.value)}
                        className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Request Type Name:</label>
                    <input
                        type="text"
                        value={req.requestTypeName}
                        onChange={(e) => handleRequestChange(reqIdx, 'requestTypeName', e.target.value)}
                        className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Input Fields:</label>
                    {req.inputFields.map((inputField, fieldIdx) => (
                        <div key={fieldIdx} className="nested-form-group">
                          <input
                              name="field"
                              placeholder="Field Name"
                              value={inputField.field}
                              onChange={e => handleFieldChange(reqIdx, 'inputFields', fieldIdx, e)}
                              className="input-field"
                          />
                          <input
                              name="type"
                              placeholder="Field Type"
                              value={inputField.type}
                              onChange={e => handleFieldChange(reqIdx, 'inputFields', fieldIdx, e)}
                              className="input-field"
                          />
                          <button type="button" onClick={() => removeField(reqIdx, 'inputFields', fieldIdx)} className="btn btn-remove">
                            Remove
                          </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addField(reqIdx, 'inputFields')} className="btn">Add Input Field</button>
                  </div>
                  <div className="form-group">
                    <label>Response Type Name:</label>
                    <input
                        type="text"
                        value={req.responseTypeName}
                        onChange={(e) => handleRequestChange(reqIdx, 'responseTypeName', e.target.value)}
                        className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Output Fields:</label>
                    {req.outputFields.map((outputField, fieldIdx) => (
                        <div key={fieldIdx} className="nested-form-group">
                          <input
                              name="field"
                              placeholder="Field Name"
                              value={outputField.field}
                              onChange={e => handleFieldChange(reqIdx, 'outputFields', fieldIdx, e)}
                              className="input-field"
                          />
                          <input
                              name="type"
                              placeholder="Field Type"
                              value={outputField.type}
                              onChange={e => handleFieldChange(reqIdx, 'outputFields', fieldIdx, e)}
                              className="input-field"
                          />
                          <button type="button" onClick={() => removeField(reqIdx, 'outputFields', fieldIdx)} className="btn btn-remove">
                            Remove
                          </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addField(reqIdx, 'outputFields')} className="btn">Add Output Field</button>
                  </div>
                  <button type="button" onClick={() => removeRequest(reqIdx)} className="btn btn-danger">Remove Request</button>
                </div>
            ))}
            <div className="form-actions">
              <button type="button" onClick={addRequest} className="btn">Add Request</button>
              <button type="button" onClick={handleGenerateClick} className="btn btn-primary">Generate API File</button>
            </div>
          </form>
          <div className="api-file-container">
            <h2>Generated API File Content:</h2>
            <pre className="api-file">{generatedApiFile}</pre>
            {generatedApiFile && <button onClick={handleCopyClick} className="btn btn-copy">Copy</button>}
            {copySuccess && <div className="copy-success">{copySuccess}</div>}
          </div>
        </div>
      </div>
  );
}

export default App;
