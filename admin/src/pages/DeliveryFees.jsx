
import React, { useEffect, useState } from "react";
import { DeliveryFeesService } from "../services/deliveryFees.service";
import { useNotification } from "../context/NotificationContext";

const DeliveryFees = () => {
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentFee, setCurrentFee] = useState({ city: "", fee: "" });
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchDeliveryFees();
  }, [currentPage]);

  const fetchDeliveryFees = async () => {
    try {
      setLoading(true);
      const result = await DeliveryFeesService.getDeliveryFees(currentPage);
      setDeliveryFees(result.fees);
      // Calculer le nombre total de pages
      setTotalPages(Math.ceil(result.count / 10));
    } catch (error) {
      showNotification("Erreur lors du chargement des frais de livraison", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, fee = null) => {
    setModalMode(mode);
    if (mode === "edit" && fee) {
      setCurrentFee(fee);
    } else {
      setCurrentFee({ city: "", fee: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentFee((prev) => ({
      ...prev,
      [name]: name === "fee" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await DeliveryFeesService.createDeliveryFee(currentFee);
        showNotification("Frais de livraison ajouté avec succès", "success");
      } else {
        await DeliveryFeesService.updateDeliveryFee(currentFee.id, currentFee);
        showNotification("Frais de livraison mis à jour avec succès", "success");
      }
      handleCloseModal();
      fetchDeliveryFees();
    } catch (error) {
      showNotification(
        `Erreur lors de l'${modalMode === "add" ? "ajout" : "édition"} du frais de livraison`,
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce frais de livraison ?")) {
      try {
        await DeliveryFeesService.deleteDeliveryFee(id);
        showNotification("Frais de livraison supprimé avec succès", "success");
        fetchDeliveryFees();
      } catch (error) {
        showNotification("Erreur lors de la suppression du frais de livraison", "error");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Frais de livraison par ville</h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ville</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Frais (DH)</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveryFees.length > 0 ? (
                  deliveryFees.map((fee) => (
                    <tr key={fee.id}>
                      <td className="py-2 px-4 border-b border-gray-200">{fee.id}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{fee.city}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{fee.fee} DH</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => handleOpenModal("edit", fee)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(fee.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 px-4 text-center">
                      Aucun frais de livraison trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <nav className="inline-flex">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border ${
                    currentPage === 1 ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  Précédent
                </button>
                <span className="px-3 py-1 border-t border-b">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border ${
                    currentPage === totalPages ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  Suivant
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal pour ajouter/éditer un frais de livraison */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "add" ? "Ajouter" : "Modifier"} un frais de livraison
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="city">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={currentFee.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="fee">
                  Frais de livraison (DH)
                </label>
                <input
                  type="number"
                  id="fee"
                  name="fee"
                  value={currentFee.fee}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {modalMode === "add" ? "Ajouter" : "Mettre à jour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryFees;
