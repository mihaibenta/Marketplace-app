import {Select, Button, Avatar, Badge, Modal} from 'antd'
import {useState} from 'react'



const {Option} = Select




const CourseCreateForm  = ({
    handleSubmit, 
    handleImage,
     handleChange, 
     values, 
     setValues, 
     preview, 
     uploadButtonText,
     handleImageRemove = (f) => f,
     editPage = false,
}) => {

    const children = []
    for (let i = 9.99; i <= 100.99; i++) {
        children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>)
    }
    const [visible,setVisible] =useState(false)

    const showModal = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
      setVisible(false);
    };
  
    const handleCancel = () => {
      setVisible(false);
    };


    return (
        <> 
          {values && <form onSubmit={handleSubmit}>
        <div className="form-group mb-2 p-2">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
          />
        </div>
    
        <div className="form-group mb-2 p-2">
          <textarea
            name="description"
            placeholder='Description'
            cols="7"
            rows="7"
            value={values.description}
            className="form-control"
            onChange={handleChange}
          ></textarea>
          <div className='d-block'> 
          
          <Modal
          title='Markdown example'
          centered 
          visible={visible}
          onOK={handleOk}
          onCancel={handleCancel} 
          onCancel ={()=> setVisible(false)}
          footer={null}
          >
          <p className='text-warning'>You can use Markdown syntax to style your description.</p> 
          <a target="_blank" href="https://www.markdownguide.org/basic-syntax/">Click here to see some examples </a>

            
          </Modal>
          
          
          <button onClick={showModal} type="button" className="btn btn-primary btn-sm mt-2">Markdown</button>
            
            </div>
        </div>
    
        <div className="form-row mb-2 p-2 d-flex">
          <div className="col">
            <div className="form-group">
              <Select
                style={{ width: "100%" }}
                size="large"
                value={values.paid}
                onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
              >
                <Option value={true}>Paid</Option>
                <Option value={false}>Free</Option>
              </Select>
            </div>
          </div>

          {values.paid && (
                
                    <div className='form-group'> 
                    <Select
                        defaultValue='$9.99'
                        style={{width:'100%'}}
                        onChange={(v) => setValues({...values, price: v})}
                        tokenSeparators={[,]}
                        size='large'
                    >
                      {children}  
                    </Select>   
                </div>
          

          )}
        </div>


        <div className="form-group mb-2 p-2">
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Category"
            value={values.category}
            onChange={handleChange}
          />
        </div>
    
        <div className="form-row mb-2 p-2 d-inline-flex ">
          <div className="col">
            <div className="form-group  ">
              <label className="btn btn-outline-secondary btn-block text-left">
                {uploadButtonText}
                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
        
        {preview && (
            
              <Badge count='X'
              onClick={handleImageRemove} className='cursor'
              >  
                <Avatar width= {200} src={preview} /> 
              </Badge>
             
        )}

        {editPage && values.image && (
        <Avatar width= {200} src={values.image.Location} /> 
        )}

        </div>
    
        <div className="row">
          <div className="col mb-2 p-2">
            <Button
              onClick={handleSubmit}
              disabled={values.loading || values.uploading}
              className="btn btn-primary "
              loading={values.loading}
              type="primary"
              size="large"
              shape="round"
            >
              {values.loading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </div>
      </form>}
        
        
        </>
    );
}



export default CourseCreateForm