import { useEffect, useState } from 'react'
import { SignIn, SignOut, useAuthentication } from '../../components/services/authService'
import { createItem, fetchItems } from '../../components/services/itemService'
import './List.css'

import urlExist from 'url-exist'

export default function List() {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageValid, setImageValid] = useState(false)

  const [items, setItems] = useState([])
  const [item, setItem] = useState(null)

  const user = useAuthentication()

  useEffect(() => {
    if (user) {
      fetchItems().then(setItems)
    }
  }, [user])

  useEffect(() => {
    const checkImage = async () => {
      const response = await urlExist(imageUrl)
      setImageValid(response)
    }
    checkImage()
  }, [imageUrl])

  // Update the "database" *then* update the internal React state. These
  // two steps are definitely necessary.
  const addItem = async ({ title, body }) => {
    await createItem({ title, body }).then(item => {
      setItem(item)
      setItems([item, ...items])
    })
  }

  const handleChange = event => {
    const { value } = event.target
    console.log('VALUE: ', value)
    setImageUrl(createImageUrl(value))
    setContent(value)
  }

  const createImageUrl = value => {
    const url = `https://spoonacular.com/cdn/ingredients_100x100/${value}.jpg`
    console.log('URL: ', url)
    return url
  }

  const handleItemClick = async (content, imageUrl) => {
    await addItem({ title: content, body: imageUrl })
  }

  console.log('ITEMS: ', items)
  console.log('ITEM: ', item)

  return (
    <div className="List">
      <header>
        Shopping List
        {!user ? <SignIn /> : <SignOut />}
      </header>

      <h3>
        What would you like to add?
      </h3>
      <p>
        Search for your item in the search bar and click the image to add it to the list.
      </p>
      <input value={content} onChange={e => handleChange(e)} />

      {imageValid && (
        <div>
          <img src={imageUrl} alt="item" onClick={() => handleItemClick(content, imageUrl)} />
        </div>
      )}
      <hr/>
      <h3>
        Current Shopping List:
      </h3>
      <div>
        {items.map(item => {
          return (
            <div key={item.id}>
              <figure>
                <img src={item.body} alt={item.title} />
                  <figcaption>{item.title}</figcaption>
              </figure>
            </div>
          )
        })}
      </div>
    </div>
  )
}
