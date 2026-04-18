/* user_index.js - User Management CRUD logic */

document.addEventListener('DOMContentLoaded', function () {
    const API_BASE = '/User';
    const form = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    const listCount = document.getElementById('list-count');
    const roleSelect = document.getElementById('roleID');
    const searchInput = document.getElementById('user-search');
    const toastContainer = document.getElementById('toast-container');
    const deleteModal = document.getElementById('delete-modal');
    
    let allUsers = [];
    let allRoles = [];
    let isEditMode = false;

    // --- Core Functions ---
    const getValue = (obj, ...keys) => keys.map(key => obj && obj[key]).find(value => value !== undefined && value !== null);
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const roleOf = user => getValue(user, 'roleResponse', 'RoleResponse') || {};
    const roleNameOf = user => getValue(roleOf(user), 'name', 'Name', 'code', 'Code', 'type', 'Type') || '-';
    const roleIdOf = user => getValue(roleOf(user), 'id', 'Id') || getValue(user, 'roleID', 'RoleID', 'roleId', 'RoleId') || '';
    const userNameOf = user => getValue(user, 'userName', 'UserName', 'email', 'Email') || '-';
    const firstNameOf = user => getValue(user, 'firstName', 'FirstName') || '';
    const lastNameOf = user => getValue(user, 'lastName', 'LastName') || '';
    const fullNameOf = user => `${firstNameOf(user)} ${lastNameOf(user)}`.trim();
    const companyBranchOf = user => {
        const company = getValue(user, 'companyCode', 'CompanyCode') || '';
        const branch = getValue(user, 'branchCode', 'BranchCode') || '';
        return [company, branch].filter(Boolean).join(' / ');
    };
    const setInputValue = (id, value) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.value = value ?? '';
        input.classList.toggle('has-value', Boolean(input.value));
    };

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-rolex-green' : 'bg-red-600';
        toast.className = `${bgColor} text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 text-sm font-bold flex items-center gap-3`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 100);
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch(`${API_BASE}/GetAllRoles`);
            const result = await response.json();
            console.log('Roles result:', result);
            const isSuccess = result.isSuccess ?? result.IsSuccess;
            const data = result.data ?? result.Data;
            
            if (isSuccess && Array.isArray(data)) {
                roleSelect.innerHTML = '<option value="" disabled selected>Rol Seçiniz</option>';
                data.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id ?? role.Id;
                    option.textContent = role.name ?? role.Name;
                    roleSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchRolesStrict = async () => {
        try {
            const response = await fetch(`${API_BASE}/GetAllRoles`);
            const result = await response.json();
            const isSuccess = result.isSuccess ?? result.IsSuccess;
            const data = result.data ?? result.Data;

            if (isSuccess && Array.isArray(data)) {
                allRoles = data;
                roleSelect.innerHTML = '<option value="" disabled selected>Rol Seçiniz</option>';
                data
                    .slice()
                    .sort((a, b) => Number(getValue(a, 'id', 'Id') || 0) - Number(getValue(b, 'id', 'Id') || 0))
                    .forEach(role => {
                        const roleId = getValue(role, 'id', 'Id', 'roleId', 'RoleId', 'roleID', 'RoleID');
                        const roleName = getValue(role, 'name', 'Name', 'code', 'Code') || `Rol ${roleId}`;
                        if (!roleId) return;

                        const option = document.createElement('option');
                        option.value = String(roleId);
                        option.textContent = roleName;
                        option.dataset.roleId = String(roleId);
                        option.dataset.roleName = roleName;
                        roleSelect.appendChild(option);
                    });
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE}/GetAll`);
            const result = await response.json();
            console.log('Users result:', result);
            const isSuccess = result.isSuccess ?? result.IsSuccess;
            const data = result.data ?? result.Data;

            if (isSuccess && Array.isArray(data)) {
                allUsers = data;
                renderList(allUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Kullanıcılar yüklenemedi!', 'error');
        }
    };

    const renderList = (users) => {
        userList.innerHTML = '';
        listCount.textContent = `${users.length} Kayıt`;

        if (users.length === 0) {
            userList.innerHTML = `
                <div class="flex flex-col items-center justify-center p-10 text-gray-400">
                    <i class="fas fa-user-slash text-3xl mb-2"></i>
                    <span class="text-xs font-semibold">Kayıt bulunamadı</span>
                </div>
            `;
            return;
        }

        users.forEach((user, index) => {
            const row = document.createElement('div');
            const id = getValue(user, 'id', 'Id') ?? 0;
            const active = getValue(user, 'active', 'Active') ?? false;
            const userName = userNameOf(user);
            const fullName = fullNameOf(user);
            const roleName = roleNameOf(user);
            const roleId = roleIdOf(user);
            const phone = getValue(user, 'phone', 'Phone') || '';
            const companyBranch = companyBranchOf(user);
            const avatarText = (fullName || userName || '?').charAt(0).toUpperCase();
            const secondaryLine = [
                fullName ? `Ad Soyad: ${escapeHtml(fullName)}` : '',
                phone ? `Tel: ${escapeHtml(phone)}` : '',
                companyBranch ? `Firma/Şube: ${escapeHtml(companyBranch)}` : ''
            ].filter(Boolean).join(' • ');

            row.className = `group grid grid-cols-4 items-center gap-4 p-4 hover:bg-gray-50 transition-all border-b border-gray-50 cursor-pointer ${index % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'}`;
            row.innerHTML = `
                <div class="col-span-2 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-rolex-green/10 flex items-center justify-center text-rolex-green text-xs font-bold">
                        ${escapeHtml(avatarText)}
                    </div>
                    <div class="flex flex-col min-w-0">
                        <span class="text-sm font-bold text-gray-800 truncate">${escapeHtml(userName)}</span>
                        <span class="text-[10px] text-gray-500 font-semibold truncate">${secondaryLine || 'Ad Soyad bilgisi yok'}</span>
                        <span class="text-[10px] text-gray-400 font-medium">ID: ${escapeHtml(id)} • Rol: ${escapeHtml(roleName)}${roleId ? ` (#${escapeHtml(roleId)})` : ''}</span>
                    </div>
                </div>
                <div class="text-center">
                    <span class="px-2 py-1 rounded-md text-[10px] font-bold ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}">
                        ${active ? 'AKTİF' : 'PASİF'}
                    </span>
                </div>
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="edit-btn w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all" data-id="${id}">
                        <i class="fas fa-pen text-[10px]"></i>
                    </button>
                    <button class="delete-btn w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all" data-id="${id}">
                        <i class="fas fa-trash text-[10px]"></i>
                    </button>
                </div>
            `;
            
            row.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    loadUserToForm(id);
                }
            });

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadUserToForm(id);
            });

            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openDeleteModal(id, fullName || userName);
            });

            userList.appendChild(row);
        });
    };

    const loadUserToForm = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/GetById?id=${id}`);
            const result = await response.json();
            const isSuccess = result.isSuccess ?? result.IsSuccess;
            const user = result.data ?? result.Data;

            if (isSuccess && user) {
                document.getElementById('userID').value = id;
                setInputValue('firstName', getValue(user, 'firstName', 'FirstName'));
                setInputValue('lastName', getValue(user, 'lastName', 'LastName'));
                setInputValue('userName', getValue(user, 'userName', 'UserName'));
                // Password should remain empty unless changing
                setInputValue('password', '');
                document.getElementById('roleID').value = roleIdOf(user);
                document.getElementById('roleID').classList.add('has-value');
                setInputValue('phone', getValue(user, 'phone', 'Phone'));
                setInputValue('companyCode', getValue(user, 'companyCode', 'CompanyCode'));
                setInputValue('branchCode', getValue(user, 'branchCode', 'BranchCode'));
                setInputValue('barkodYaziciAdi', getValue(user, 'barkodYaziciAdi', 'BarkodYaziciAdi'));
                setInputValue('fisYaziciAdi', getValue(user, 'fisYaziciAdi', 'FisYaziciAdi'));
                setInputValue('varsayilanYaziciAdi', getValue(user, 'varsayilanYaziciAdi', 'VarsayilanYaziciAdi'));
                document.getElementById('active').checked = getValue(user, 'active', 'Active') ?? false;
                
                setEditMode(true);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            showToast('Kullanıcı bilgileri alınamadı!', 'error');
        }
    };

    const setEditMode = (edit) => {
        isEditMode = edit;
        document.getElementById('add-mode-buttons').classList.toggle('hidden', edit);
        document.getElementById('edit-mode-buttons').classList.toggle('hidden', !edit);
        document.getElementById('form-title').textContent = edit ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Bilgileri';
        document.getElementById('form-desc').textContent = edit ? 'Mevcut kullanıcı bilgilerini güncelleyin.' : 'Sisteme yeni bir kullanıcı ekleyin.';
        
        if (!edit) {
            form.reset();
            document.querySelectorAll('.form-input').forEach(input => input.classList.remove('has-value'));
            document.getElementById('userID').value = '';
        }
    };

    // --- Event Listeners ---

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const selectedRoleOption = roleSelect.selectedOptions[0];
        const selectedRoleId = parseInt(selectedRoleOption?.dataset.roleId || selectedRoleOption?.value || roleSelect.value, 10);

        if (!Number.isInteger(selectedRoleId) || selectedRoleId <= 0) {
            showToast('Lütfen kullanıcı rolü seçin.', 'error');
            return;
        }

        const formData = {
            Id: parseInt(document.getElementById('userID').value) || 0,
            FirstName: document.getElementById('firstName').value.trim(),
            LastName: document.getElementById('lastName').value.trim(),
            UserName: document.getElementById('userName').value.trim(),
            Password: password,
            ConfirmPassword: password,
            RoleId: selectedRoleId,
            RoleID: selectedRoleId,
            roleID: selectedRoleId,
            Phone: document.getElementById('phone').value.trim(),
            CompanyCode: document.getElementById('companyCode').value.trim(),
            BranchCode: document.getElementById('branchCode').value.trim(),
            BarkodYaziciAdi: document.getElementById('barkodYaziciAdi').value.trim(),
            FisYaziciAdi: document.getElementById('fisYaziciAdi').value.trim(),
            VarsayilanYaziciAdi: document.getElementById('varsayilanYaziciAdi').value.trim(),
            Active: document.getElementById('active').checked
        };
        console.log('[user_index] Saving user role:', selectedRoleId, selectedRoleOption?.dataset.roleName || selectedRoleOption?.textContent);

        const endpoint = isEditMode ? 'Update' : 'Create';
        const method = 'POST'; // Controller uses [HttpPost] for both

        try {
            const response = await fetch(`${API_BASE}/${endpoint}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.isSuccess) {
                showToast(isEditMode ? 'Kullanıcı güncellendi.' : 'Kullanıcı eklendi.');
                setEditMode(false);
                fetchUsers();
            } else {
                showToast(result.message || 'Bir hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            showToast('Kaydetme sırasında hata oluştu!', 'error');
        }
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allUsers.filter(u => [
            userNameOf(u),
            fullNameOf(u),
            firstNameOf(u),
            lastNameOf(u),
            roleNameOf(u),
            companyBranchOf(u),
            getValue(u, 'phone', 'Phone') || ''
        ].some(value => String(value).toLowerCase().includes(term)));
        renderList(filtered);
    });

    document.getElementById('vazgec-btn').addEventListener('click', () => setEditMode(false));
    document.getElementById('vazgec-guncelle-btn').addEventListener('click', () => setEditMode(false));
    
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value) input.classList.add('has-value');
            else input.classList.remove('has-value');
        });
    });

    // Delete Modal Logic
    let userToDelete = null;
    const openDeleteModal = (id, name) => {
        userToDelete = id;
        document.getElementById('modal-user-name').textContent = name;
        deleteModal.classList.remove('hidden');
    };

    document.getElementById('cancel-delete-btn').addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        userToDelete = null;
    });

    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
        if (!userToDelete) return;
        try {
            const response = await fetch(`${API_BASE}/Delete?id=${userToDelete}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.isSuccess) {
                showToast('Kullanıcı silindi.');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Silme hatası!', 'error');
        } finally {
            deleteModal.classList.add('hidden');
            userToDelete = null;
        }
    });

    // --- Init ---
    fetchRolesStrict();
    fetchUsers();
});
