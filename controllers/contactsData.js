const { Contact } = require('../models')

const listContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 2 } = req.query
    const skip = (page - 1) * limit
    const result = await Contact.find({}, '', { skip, limit: +limit })
    const pages = await Contact.find({})
    res.json({
      total: pages.length,
      pages: Math.ceil(pages.length / limit),
      result
    })
  } catch (error) {
    next(error)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await Contact.findById(contactId)
    if (!contact) {
      return res.status(404).json({
        message: 'not found'
      })
    }
    res.json({
      contact
    })
  } catch (error) {
    next(error)
  }
}

const addContact = async (req, res, next) => {
  try {
    const result = await Contact.create(req.body)
    res.status(201).json({
      result
    })
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const updateContact = await Contact.findByIdAndUpdate(contactId, req.body)
    if (!updateContact) {
      return res.status(404).json({
        message: 'Not found'
      })
    }
    res.status(200).json({
      updateContact
    })
  } catch (error) {
    next(error)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const deleteContact = await Contact.findByIdAndDelete(contactId)
    if (!deleteContact) {
      return res.status(404).json({
        message: 'not found'
      })
    }
    res.json({
      deleteContact,
      message: 'contact deleted'
    })
  } catch (error) {
    next(error)
  }
}

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const { favourite = false } = req.body
    if (!req.body) {
      return res.status(400).json({
        message: 'missing field favorite'
      })
    }

    const updateContact = await Contact.findByIdAndDelete(contactId, { favourite }, { new: true })
    if (!updateContact) {
      return res.status(404).json({
        message: 'Not found'
      })
    }
    res.status(200).json({
      updateContact,
      message: 'contact updated'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
