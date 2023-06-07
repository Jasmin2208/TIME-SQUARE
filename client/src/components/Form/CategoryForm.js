import React from 'react'

function CategoryForm({ handleSubmit, value, setValue }) {
    return (
        <>
            <form  onSubmit={handleSubmit} className='w-75'> 
                <div className='row'>
                    <div className="col">
                        <input type="text" className="form-control" id="inputPassword2" placeholder="Enter New Category" onChange={(e) => setValue(e.target.value)} value={value} />
                    </div>
                    <div className="col">
                        <button type="submit" className="btn btn-primary mb-3">Submit</button>
                    </div>
                </div>
            </form>

        </>
    )
}

export default CategoryForm 