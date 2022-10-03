import Header from "../Header/Header";
import DocumentCard from "../DocumentCard/DocumentCard";
import { useState, useEffect } from "react";
import { IDocument } from "../../types/types";
import axios from "axios";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(15);
  const [fetching, setFetching] = useState<boolean>(true);
  const [idSearch, setIdSearch] = useState<string>("");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [titleSearch, setTitleSearch] = useState<string>("");
  const [typeOfSort, setTypeOfSort] = useState<string>("");
  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  useEffect(() => {
    if (fetching) {
      axios
        .get<IDocument[]>(
          `http://www.filltext.com/?rows=${currentPage}&id={index}&date={date|01-01-2010,10-12-2022}&title={lorem|3}&body={lorem|20}&pretty=true`
        )
        .then((response) => {
          setDocuments([...documents, ...response.data]);
          setCurrentPage((prevState) => prevState + 15);
        })
        .finally(() => setFetching(false));
    }
  }, [currentPage, documents, fetching]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = (): void => {
    if (
      document.documentElement.scrollHeight -
        (document.documentElement.scrollTop + window.innerHeight) <
      100
    ) {
      setFetching(true);
    }
  };

  const filteredDocuments = documents
  .filter((doc) => {
    if(idSearch === doc.id.toString()){
      return doc.id.toString().includes(idSearch);
    } else if(idSearch.length === 0){
      return doc.id.toString().includes(idSearch);
    }
  })
    .filter((doc) => {
      return doc.title.toLowerCase().includes(titleSearch);
    })
    .filter((doc) => {
      if (!dateStart) {
        return doc.date.substring(0, 10);
      } else {
        return Date.parse(doc.date.substring(0, 10)) > Date.parse(dateStart);
      }
    })
    .filter((doc) => {
      if (!dateEnd) {
        return doc.date.substring(0, 10);
      } else {
        return Date.parse(doc.date.substring(0, 10)) < Date.parse(dateEnd);
      }
    });
   

    console.log(filteredDocuments);
    

  const handleSorting = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const documentCopy = [...documents];
    if (e.target.value === "upToDown" && typeOfSort === "dateSort") {
      documentCopy.sort(
        (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
      );
    } else if (e.target.value === "downToUp" && typeOfSort === "dateSort") {
      documentCopy.sort(
        (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
      );
    } else if (e.target.value === "upToDown" && typeOfSort === "wordsSort") {
      documentCopy.sort((titleA, titleB) => {
        return `${titleA.title}`.localeCompare(`${titleB.title}`);
      });
    } else if (e.target.value === "downToUp" && typeOfSort === "wordsSort") {
      documentCopy.sort((titleA, titleB) => {
        return `${titleB.title}`.localeCompare(`${titleA.title}`);
      });
    }
    setDocuments(documentCopy);
  };

  const handleIdSearchId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdSearch(e.target.value);
    if (e.target.value.length > 0) {
      setDisabledInput(true);
    } else if (e.target.value.length === 0) {
      setDisabledInput(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="mainWrapper">
        <div className="formWrapper">
          <form className="formContainer">
            <label htmlFor="idInput">
              <h2>ID Документа</h2>
              <input type="number" id="idInput" onChange={handleIdSearchId}/>
              {disabledInput ? <div className="inputIdMessage">Если заполнено поле <strong>ID документа</strong>, все остальные поля проигнорированы</div> : ''}
            </label>
            <label htmlFor="dateInputStart">
              <h2>Создан</h2>
              <div className="sortWrapper">
              <input
                type="date"
                id="dateInputStart"
                onChange={(e) => setDateStart(e.target.value)}
                disabled={disabledInput}
              />
              <input
                type="date"
                id="dateInputEnd"
                onChange={(e) => setDateEnd(e.target.value)}
                disabled={disabledInput}
              />
              </div>
            </label>
            <label htmlFor="titleInput">
              <h2>Название документа</h2>
              <input
                type="text"
                id="titleInput" 
                onChange={(e) => setTitleSearch(e.target.value)}
                disabled={disabledInput}
              />
            </label>
            <label htmlFor="sortInputType">
              <h2>Сортировка</h2>
              <div className="sortWrapper">
              <select
                id="sortInputType"
                onChange={(e) => setTypeOfSort(e.target.value)}
                disabled={disabledInput}
              >
                <option value="" selected>
                  -выбрать-
                </option>
                <option value="dateSort">по дате</option>
                <option value="wordsSort">по алфавиту</option>
              </select>
              <select
                id="sortInputValue"
                onChange={handleSorting}
                disabled={disabledInput}
              >
                <option value="" selected>
                  -выбрать-
                </option>
                <option value="upToDown">по возрастанию</option>
                <option value="downToUp">по убыванию</option>
              </select>
              </div>
            </label>
          </form>
        </div>
        <div className="listWrapper">
          {filteredDocuments.map((docs) => (
            <DocumentCard key={docs.id} document={docs} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
