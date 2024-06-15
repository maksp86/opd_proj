import Home from './pages/Home.jsx'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Container, Modal } from 'react-bootstrap'

import Navigation from "./components/Navigation"
import TopBar from './components/TopBar.jsx'

import Account from './pages/Account.jsx'
import NotFound from './pages/NotFound.jsx'
import LoginPage from './pages/Login.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'

import './main.scss'
import { UserContext } from './context/user.context.js'
import { ApiContext } from './context/api.context.js'
import { useModal } from './hooks/modal.hook.js'
import { useApi } from './hooks/api.hook.js'
import { useUser } from './hooks/user.hook.js'
import { useConstructor } from './hooks/constructor.hook.js'
import { useEffect } from 'react'
import { ModalContext } from './context/modal.context.js'
import { ThemeContext } from './context/theme.context.js'
import ErrorMessageModal from './pages/modals/ErrorMessageModal.jsx'
import CategoryEditPage from './pages/CategoryEditPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import TaskEditPage from './pages/TaskEditPage.jsx'
import TaskPage from './pages/TaskPage.jsx'
import { BreadcrumbsContext } from './context/breadcrumbs.context.js'
import { ServerInfoContext } from './context/serverinfo.context.js'
import { useBreadcrumbs } from './hooks/breadcrumbs.hook.js'
import { useTheme } from './hooks/theme.hook.js'
import ManagementPage from './pages/UsersEditPage.jsx'
import UserViewPage from './pages/UserViewPage.jsx'
import { useServerInfo } from './hooks/serverInfo.hook.js'
import ContactsPage from './pages/ContactsPage.jsx'


function App() {
    const apiHook = useApi();
    const userHook = useUser();
    const modalHook = useModal();
    const breadcrumbsHook = useBreadcrumbs();
    const themeHook = useTheme();
    const serverinfoHook = useServerInfo();

    async function fetchUserStats() {
        userHook.setUpdateRequest(false)
        let result = await apiHook.request("/stats/user?id=" + userHook.user._id)

        if (result) {
            userHook.updateUser(result.data.value.foundUser)
            userHook.setComputedXp(result.data.value.rating)
        }
    }

    async function fetchServerInfo() {
        let result = await apiHook.request("/info/")

        if (result) {
            serverinfoHook.set(result.data.value)
        }
    }

    useConstructor(() => {
        themeHook.load();
        userHook.load();
        serverinfoHook.load();
        userHook.setUpdateRequest(true);
        fetchServerInfo();
    })

    useEffect(() => {
        if (userHook.loggedIn && userHook.updateRequest) {
            fetchUserStats();
        }
    }, [userHook.loggedIn, userHook.updateRequest])

    useEffect(() => {
        if (apiHook.error) {
            console.log("api error in app.jsx ", JSON.stringify(apiHook.error))
            if (apiHook.error.status === "error_not_logined" && apiHook.error.httpcode === 403) {
                userHook.logout();
                document.location = "/"
            }
            else if (!apiHook.error.preventNext) {
                modalHook.show(<ErrorMessageModal error={apiHook.error} />)
            }

            apiHook.clearError();
        }
    }, [apiHook.error])

    return (
        <ApiContext.Provider value={apiHook}>
            <UserContext.Provider value={userHook}>
                <ServerInfoContext.Provider value={serverinfoHook}>
                    <ModalContext.Provider value={modalHook}>
                        <BreadcrumbsContext.Provider value={breadcrumbsHook}>
                            <ThemeContext.Provider value={themeHook}>
                                <Modal
                                    show={modalHook.isOpen}
                                    onHide={() => modalHook.close()}
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    backdrop={modalHook.isClosable ? true : "static"}
                                    keyboard={modalHook.isClosable}
                                >
                                    <Modal.Body>
                                        {modalHook.content}
                                    </Modal.Body>
                                </Modal>
                                <BrowserRouter>
                                    <TopBar user={userHook.user} />
                                    <Container className="maincontainer py-4">
                                        <Routes>
                                            <Route path='/' element={<Home />} />
                                            <Route path='/contacts' element={<ContactsPage />} />
                                            {(userHook.loggedIn === false) &&
                                                <>
                                                    <Route path='/login' element={<LoginPage />} />
                                                    <Route path='*' element={<Navigate replace to="/login" />} />
                                                </>
                                            }

                                            {(userHook.loggedIn === true) &&
                                                <>
                                                    <Route path='/account' element={<Account />} />
                                                    <Route path='/learning' key="learningCategories" element={<CategoriesPage isLearning={true} />} />
                                                    <Route path='/learning/:category' key="learning" element={<TasksPage />} />
                                                    <Route path='/tasks' element={<CategoriesPage key="taskCategories" isLearning={false} />} />
                                                    <Route path='/task/:id' element={<TaskPage key="taskView" />} />
                                                    <Route path='/tasks/:category' element={<TasksPage key="tasks" />} />
                                                    <Route path='/category/edit/' element={<CategoryEditPage />} />
                                                    <Route path='/task/edit/' element={<TaskEditPage />} />
                                                    <Route path='/user/:id' element={<UserViewPage />} />
                                                    <Route path='/manage' element={<ManagementPage />} />
                                                    <Route path='*' key="notfound" element={<NotFound />} />
                                                </>
                                            }

                                        </Routes>
                                    </Container>
                                    <Navigation />
                                </BrowserRouter>
                            </ThemeContext.Provider>
                        </BreadcrumbsContext.Provider>
                    </ModalContext.Provider>
                </ServerInfoContext.Provider>
            </UserContext.Provider>
        </ApiContext.Provider>
    )
}

export default App;