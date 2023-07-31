import React from 'react'

import { ReactSubmitEvent } from '../../types'
import styles from './AddCategory.module.css'

export interface AddCategoryProps {
  submitHandler: (event: ReactSubmitEvent) => void
  changeHandler: (value: string) => void
  resetHandler: () => void
  tempCategoryName: string
}

export const AddCategory: React.FC<AddCategoryProps> = ({
  submitHandler,
  changeHandler,
  resetHandler,
  tempCategoryName,
}) => {
  return (
    <form onSubmit={submitHandler}>
      <input
        className={styles.categoryInput}
        type="text"
        autoFocus
        maxLength={20}
        onChange={(event) => {
          changeHandler(event.target.value)
        }}
        onBlur={(event) => {
          if (!tempCategoryName || tempCategoryName.trim() === '') {
            resetHandler()
          } else {
            submitHandler(event)
          }
        }}
      />
    </form>
  )
}
