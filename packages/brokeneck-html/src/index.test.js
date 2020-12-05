import '.'

jest.mock('@nearform/brokeneck-react', () => jest.fn())

describe('index', () => {
  it('should export the Brokeneck object on the window', () => {
    expect(window.Brokeneck).toBeDefined()
    expect(typeof window.Brokeneck.init).toBe('function')
  })

  it('should render the Brokeneck component on root element when init is called', () => {
    const config = { some: 'config' }

    const Brokeneck = jest.requireMock('@nearform/brokeneck-react')
    Brokeneck.mockReturnValue('dummy render output')

    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    window.Brokeneck.init(config)

    expect(Brokeneck).toHaveBeenCalledWith(config, expect.any(Object))
  })
})
