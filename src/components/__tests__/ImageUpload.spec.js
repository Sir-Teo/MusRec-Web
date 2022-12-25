import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ImageUpload from '../ImageUpload.vue'

describe('ImageUpload', () => {
  it('renders properly', () => {
    const wrapper = mount(ImageUpload, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
