import Editor from "@monaco-editor/react";
import { useRef, useContext, useState} from "react" 
import type { editor } from 'monaco-editor';
import DropDownMenu from '../../components/DropDownMenu';
import DropDownItem from '../../components/DropDownItem';
import './IDE.scss'
import { TEMPLATE_CODE } from './IDEStarterCode'
import config from '../../environment'

const IDE = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState(TEMPLATE_CODE['python3']);
  const [language, setLanguage] = useState('python3');
  const [output, setOutput] = useState('');
  const [codeByLanguage, setCodeByLanguage] = useState<{ [key: string]: string }>({
    python3: TEMPLATE_CODE['python3'],
    java: TEMPLATE_CODE['java']
  });
  
  const onMount = (editor: editor.IStandaloneCodeEditor) => { 
    editorRef.current = editor; 
    editor.focus(); 
  }

  const languageOptions = ["python3", "java"];
  const displayLanguage = language === 'python3' ? 'python' : language;
  const selectLanguage = (newLanguage: string) => { 
    // Save current code
    setCodeByLanguage(prev => ({ ...prev, [language]: value }));
    // Switch language
    setLanguage(newLanguage); 
    // Load code for new language
    setValue(codeByLanguage[newLanguage] || TEMPLATE_CODE[newLanguage]);
  }

  const executeCode = async () => {
    try {
      const response = await fetch(`${config.API_URL}/scratch/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code: value,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOutput(data.stdout || data.stderr || 'No output');
      } else {
        setOutput(`Error: ${data.message}`);
      }
    } catch (error) {
      setOutput('Error executing code');
    }
  };
  
  return (
    <>
      <div className="IDEExecutables">
          <DropDownMenu
              buttonText={`Language: ${displayLanguage}`}   
              content={(close) => <>
                { 
                  languageOptions.map(item => <DropDownItem key={item} onClick={() => { selectLanguage(item); close(); }}>
                    {item === 'python3' ? 'python' : item}
                  </DropDownItem>)
                }
              </>}
            />
            <div className="executeCode"> 
              <button className="executeCode-btn" onClick={executeCode}> 
                Execute Code
              </button>
            </div>
      </div>
      <div className="IDEMain">
        <div className="IDEContainer">
          <Editor
            theme="vs-dark"
            language={displayLanguage}
            onMount={onMount}
            defaultValue="//Write Code here"
            value={value}
            onChange={(value) => {
              setValue(value || "");
              setCodeByLanguage(prev => ({ ...prev, [language]: value || "" }));
            }}
          />
        </div>
        <div className="IDEResults">
            <pre>{output}</pre>
        </div> 
      </div>
    </>
  );
};

export default IDE;