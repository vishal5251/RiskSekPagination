import './App.scss';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from '@carbon/icons-react';

function App() {

  const [data, setData] = useState([]);
  const [limitData, setLimitData] = useState([]); // data.slice(skip, limit)
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);

  const status = new Map([
    [0, "On Track"],
    [1, "At Risk"],
    [2, "Off Track"],
    [3, "Complete"]
  ]);

  useEffect(() => {
    fetch('https://cb33b862-4156-4a74-878a-cecd9152a213.mock.pstmn.io/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'PMAK-645111a56b18be1cb13a3e76-e811469e3175a1e68ffed2aecac0532dcf'
      }
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLimitData(data.slice(skip, limit));
      })
  }, [])

  useEffect(() => {
    setLimitData(data.slice(skip, skip + limit));
  }, [skip, limit])

  useEffect(() => {
  }, [limitData])

  function handleLimitChange(e) {
    setLimit(e.target.value);
  }

  function handleForward() {
    setSkip(skip + limit);
    setPage(page + 1);
  }

  function handleBackward() {
    setSkip(skip - limit);
    setPage(page - 1);
  }

  function handleSearchResults(e) {
    const searchResults = data.filter((element) => {
      return element.project_name.toLowerCase().includes(e.target.value.toLowerCase());
    })
    setLimitData(searchResults);
  }
  
  function handleStatusFilter(e) {
    const searchResults = data.filter((element) => {
      return element.status === parseInt(e.target.value);
    })
    setLimitData(searchResults);
  }

  const leadrows = limitData.map((element, id) => (
    <tr key={id}>
      <td>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" />
        </div>
      </td>
      <td>{id + 1}</td>
      <td>{element.project_name}</td>
      <td>{element.project_manager}</td>
      <td>{status.get(element.status)}</td>
      <td>{element.last_update}</td>
      <td>{element.resources}</td>
      <td>{element.timeline.start}</td>
      <td>{element.estimation}</td>
      <td>

        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ...
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Edit</a></li>
            <li><a className="dropdown-item" href="#">Delete</a></li>
          </ul>
        </div>

      </td>
    </tr>
  ));

  return (
    <>
      <div className="h-full px-4 w-full space-y-4">


        <div className='flex justify-between'>
          <div className='flex space-x-2'>
            <select onChange={handleStatusFilter} placeholder='Status' className='w-[100px] py-1 px-2 border-2 rounded'>
              <option value={-1}>Status</option>
              <option value={0}>On Track</option>
              <option value={1}>At Risk</option>
              <option value={2}>Off Track</option>
              <option value={3}>Complete</option>
            </select>
            <button className='py-1 px-2 space-x-1 flex items-center border-2 rounded'>
              <span><Filter /></span><span>More filter</span>
            </button>
          </div>


        </div>
        <div className='border rounded-lg'>

          <div className='search'>
            <form className="search-form">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="search-icon"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
              <input
                className="search-input"
                type="text"
                aria-label="Search projects"
                placeholder="Search projects"
                onChange={handleSearchResults}
              />
            </form>
            <div className='set-pagination'>
              <div className='set-page-skip'>
                <button onClick={() => {
                  handleBackward();
                }}><ChevronLeft/></button>
                <span>{page}</span>
                <button onClick={() => {
                  handleForward();
                }}><ChevronRight/></button>
              </div>
              <div className='set-page-results'>
                <span>Showing</span>
                <select onChange={handleLimitChange} name="" id="">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>of {data.length} results</span>
              </div>
            </div>
          </div>
          <div className='table-container'>
            <table className='table'>
              <thead>
                <tr >
                  <th>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" />
                    </div>
                  </th>
                  <th scope='col'>#</th>
                  <th scope='col'>PROJECT NAME</th>
                  <th scope='col'>PM</th>
                  <th scope='col'>STATUS</th>
                  <th scope='col'>LAST UPDATE</th>
                  <th scope='col'>RESOURCES</th>
                  <th scope='col'>PROJECT TIMELINE</th>
                  <th scope='col'>ESTIMATION</th>
                </tr>
              </thead>
              <tbody>{leadrows}</tbody>
            </table>
          </div>

        </div>
      </div>

    </>
  )
}

export default App;
