export const TOAST_MESSAGES = {
  TRANSACTION: {
    CREATE_SUCCESS: {
      title: "Transacción registrada",
      description: "La transacción ha sido guardada con éxito."
    },
    UPDATE_SUCCESS: {
      title: "Transacción actualizada", 
      description: "La transacción ha sido actualizada con éxito."
    },
    CREATE_ERROR: {
      title: "Error",
      description: "No se pudo registrar la transacción. Por favor, inténtelo de nuevo."
    },
    UPDATE_ERROR: {
      title: "Error",
      description: "No se pudo actualizar la transacción. Por favor, inténtelo de nuevo."
    }
  },
  LOAN_PAYMENT: {
    CREATE_SUCCESS: {
      title: "Abono registrado",
      description: "El abono ha sido registrado con éxito."
    },
    DELETE_SUCCESS: {
      title: "Abono eliminado",
      description: "El abono ha sido eliminado con éxito."
    },
    CREATE_ERROR: {
      title: "Error",
      description: "No se pudo registrar el abono. Por favor, inténtelo de nuevo."
    },
    DELETE_ERROR: {
      title: "Error",
      description: "No se pudo eliminar el abono. Por favor, inténtelo de nuevo."
    }
  },
  DOCUMENT: {
    CREATE_SUCCESS: {
      title: "Documento agregado",
      description: "El documento se ha guardado correctamente."
    },
    UPDATE_SUCCESS: {
      title: "Documento actualizado",
      description: "Los cambios se han guardado correctamente."
    },
    DELETE_SUCCESS: {
      title: "Documento eliminado",
      description: "El documento se ha eliminado correctamente."
    },
    CREATE_ERROR: {
      title: "Error",
      description: "No se pudo guardar el documento."
    },
    UPDATE_ERROR: {
      title: "Error",
      description: "No se pudo actualizar el documento."
    },
    DELETE_ERROR: {
      title: "Error",
      description: "No se pudo eliminar el documento."
    }
  }
} as const;