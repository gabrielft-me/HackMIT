import { InputBox } from '../components/InputBox'

const SearchPage = () => {
  return (
    <div className="container-fluid py-4" style={{ minHeight: '100vh' }}>
      {/* Top input box */}
      <div className="row mb-4 justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <InputBox />
        </div>
      </div>
      {/* Flexbox containers */}
      <div className="d-flex flex-row flex-grow-1" style={{ minHeight: '60vh' }}>
        <div className="flex-fill border rounded bg-light m-2 p-3">
          <h5>Container 1</h5>
          {/* Content here */}
        </div>
        <div className="flex-fill border rounded bg-light m-2 p-3">
          <h5>Container 2</h5>
          {/* Content here */}
        </div>
        <div className="flex-fill border rounded bg-light m-2 p-3">
          <h5>Container 3</h5>
          {/* Content here */}
        </div>
      </div>
    </div>
  )
}

export default SearchPage