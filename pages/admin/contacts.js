import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLogin from '../../components/AdminLogin';

export default function AdminContacts({ contacts: initialContacts, isAuthenticated }) {
    const [authenticated, setAuthenticated] = useState(isAuthenticated);
    const [contacts, setContacts] = useState(initialContacts || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const contactsPerPage = 15;
    const router = useRouter();

    useEffect(() => {
        // Check for stored token on client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('admin_token');
            if (token && !authenticated) {
                setAuthenticated(true);
            }
        }
    }, [authenticated]);

    const handleLogin = (token) => {
        setAuthenticated(true);
    };



    const viewContact = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedContact(null);
    };

    const confirmDelete = (contact) => {
        setDeleteConfirm(contact);
    };

    const handleDeleteContact = async (contactId) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/admin/contacts/${contactId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                },
            });

            if (response.ok) {
                // Remove the contact from the local state
                setContacts(prev => prev.filter(contact => contact.id !== contactId));
                setDeleteConfirm(null);
                alert('Contact deleted successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to delete contact: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('An error occurred while deleting the contact');
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Pagination logic
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
    const totalPages = Math.ceil(contacts.length / contactsPerPage);

    if (!authenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <Link href="/admin" style={{
                        color: '#2d5016',
                        textDecoration: 'none',
                        fontSize: '14px',
                        marginBottom: '8px',
                        display: 'block'
                    }}>
                        ← Back to Admin Dashboard
                    </Link>
                    <h1 style={{ margin: 0, color: '#2d5016' }}>Contact Messages</h1>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Project Type</th>
                            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Location</th>
                            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContacts.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                                    No contact messages found
                                </td>
                            </tr>
                        ) : (
                            currentContacts.map((contact) => (
                                <tr key={contact.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <a href={`mailto:${contact.email}`} style={{ color: '#2d5016', textDecoration: 'none' }}>
                                            {contact.email}
                                        </a>
                                    </td>
                                    <td style={{ padding: '15px' }}>{contact.project_type}</td>
                                    <td style={{ padding: '15px' }}>{contact.location}</td>
                                    <td style={{ padding: '15px', fontSize: '14px', color: '#6c757d' }}>
                                        {formatDate(contact.created_at)}
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => viewContact(contact)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#2d5016',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(contact)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '10px' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: currentPage === 1 ? '#ccc' : '#2d5016',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Previous
                    </button>

                    <span style={{ margin: '0 20px' }}>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: currentPage === totalPages ? '#ccc' : '#2d5016',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Contact Details Modal */}
            {showModal && selectedContact && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={closeModal}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ padding: '25px 30px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0, color: '#2d5016' }}>Contact Details</h2>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                        color: '#999',
                                        padding: '0',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            <p style={{ margin: '10px 0 20px', color: '#6c757d', fontSize: '14px' }}>
                                Submitted on {formatDate(selectedContact.created_at)}
                            </p>
                        </div>

                        <div style={{ padding: '25px 30px' }}>
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ margin: '0 0 15px', color: '#2d5016', fontSize: '18px' }}>Contact Information</h3>
                                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Name:</strong> {selectedContact.name}
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Email:</strong>
                                        <a href={`mailto:${selectedContact.email}`} style={{ color: '#2d5016', marginLeft: '8px' }}>
                                            {selectedContact.email}
                                        </a>
                                    </div>
                                    <div>
                                        <strong>Phone:</strong>
                                        <a href={`tel:${selectedContact.phone}`} style={{ color: '#2d5016', marginLeft: '8px' }}>
                                            {selectedContact.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ margin: '0 0 15px', color: '#2d5016', fontSize: '18px' }}>Project Details</h3>
                                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Project Type:</strong> {selectedContact.project_type}
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Location:</strong> {selectedContact.location}
                                    </div>
                                    <div>
                                        <strong>Budget Range:</strong> {selectedContact.budget_range}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ margin: '0 0 15px', color: '#2d5016', fontSize: '18px' }}>Message</h3>
                                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px' }}>
                                    <p style={{ margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                        {selectedContact.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '0 30px 30px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <a
                                    href={`mailto:${selectedContact.email}?subject=Re: Your enquiry about ${selectedContact.project_type}&body=Dear ${selectedContact.name},%0D%0A%0D%0AThank you for your enquiry about ${selectedContact.project_type}.%0D%0A%0D%0A`}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#2d5016',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '6px',
                                        fontSize: '16px'
                                    }}
                                >
                                    Reply by Email
                                </a>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1001,
                        padding: '20px'
                    }}
                    onClick={() => setDeleteConfirm(null)}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            maxWidth: '400px',
                            width: '100%',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ padding: '30px' }}>
                            <h3 style={{ margin: '0 0 15px 0', color: '#dc3545' }}>Confirm Delete</h3>
                            <p style={{ margin: '0 0 25px 0', color: '#4b5563', lineHeight: '1.5' }}>
                                Are you sure you want to delete the message from <strong>{deleteConfirm.name}</strong>?
                                This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deleting}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: deleting ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteContact(deleteConfirm.id)}
                                    disabled={deleting}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: deleting ? '#9ca3af' : '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: deleting ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export async function getServerSideProps({ req }) {
    // Check authentication
    const isAuthenticated = !!req.cookies?.admin_token;

    try {
        let contacts = [];
        if (isAuthenticated) {
            // Only load contacts if authenticated - import here to avoid SSR issues
            const { getContacts } = await import('../../lib/database');
            contacts = await getContacts();
        }

        return {
            props: {
                contacts: JSON.parse(JSON.stringify(contacts)),
                isAuthenticated
            }
        };
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return {
            props: {
                contacts: [],
                isAuthenticated
            }
        };
    }
}
