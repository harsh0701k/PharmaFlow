import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/organization/organizationSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const OrganizationView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector((state) => state.organization);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View organization')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View organization')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{organization?.name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Users Organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>

                      <th>Last Name</th>

                      <th>Phone Number</th>

                      <th>E-Mail</th>

                      <th>Disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.users_organization &&
                      Array.isArray(organization.users_organization) &&
                      organization.users_organization.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/users/users-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='firstName'>{item.firstName}</td>

                          <td data-label='lastName'>{item.lastName}</td>

                          <td data-label='phoneNumber'>{item.phoneNumber}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='disabled'>
                            {dataFormatter.booleanFormatter(item.disabled)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organization?.users_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Appointments organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>AppointmentDate</th>

                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.appointments_organization &&
                      Array.isArray(organization.appointments_organization) &&
                      organization.appointments_organization.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/appointments/appointments-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='appointment_date'>
                              {dataFormatter.dateTimeFormatter(
                                item.appointment_date,
                              )}
                            </td>

                            <td data-label='location'>{item.location}</td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organization?.appointments_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Inventories organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>MedicineName</th>

                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.inventories_organization &&
                      Array.isArray(organization.inventories_organization) &&
                      organization.inventories_organization.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/inventories/inventories-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='medicine_name'>
                            {item.medicine_name}
                          </td>

                          <td data-label='quantity'>{item.quantity}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organization?.inventories_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Patients organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>FirstName</th>

                      <th>LastName</th>

                      <th>DateofBirth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.patients_organization &&
                      Array.isArray(organization.patients_organization) &&
                      organization.patients_organization.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/patients/patients-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='first_name'>{item.first_name}</td>

                          <td data-label='last_name'>{item.last_name}</td>

                          <td data-label='date_of_birth'>
                            {dataFormatter.dateTimeFormatter(
                              item.date_of_birth,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organization?.patients_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Prescriptions organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>IssuedDate</th>

                      <th>MedicationDetails</th>

                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.prescriptions_organization &&
                      Array.isArray(organization.prescriptions_organization) &&
                      organization.prescriptions_organization.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/prescriptions/prescriptions-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='issued_date'>
                              {dataFormatter.dateTimeFormatter(
                                item.issued_date,
                              )}
                            </td>

                            <td data-label='medication_details'>
                              {item.medication_details}
                            </td>

                            <td data-label='status'>{item.status}</td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organization?.prescriptions_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/organization/organization-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

OrganizationView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_ORGANIZATION'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default OrganizationView;
