import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/patients/patientsSlice';
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

const PatientsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patients);

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
        <title>{getPageTitle('View patients')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View patients')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>FirstName</p>
            <p>{patients?.first_name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>LastName</p>
            <p>{patients?.last_name}</p>
          </div>

          <FormField label='DateofBirth'>
            {patients.date_of_birth ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  patients.date_of_birth
                    ? new Date(
                        dayjs(patients.date_of_birth).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No DateofBirth</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>User</p>

            <p>{patients?.user?.firstName ?? 'No data'}</p>
          </div>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{patients?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <>
            <p className={'block font-bold mb-2'}>Appointments Patient</p>
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
                    {patients.appointments_patient &&
                      Array.isArray(patients.appointments_patient) &&
                      patients.appointments_patient.map((item: any) => (
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
                      ))}
                  </tbody>
                </table>
              </div>
              {!patients?.appointments_patient?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Prescriptions Patient</p>
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
                    {patients.prescriptions_patient &&
                      Array.isArray(patients.prescriptions_patient) &&
                      patients.prescriptions_patient.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/prescriptions/prescriptions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='issued_date'>
                            {dataFormatter.dateTimeFormatter(item.issued_date)}
                          </td>

                          <td data-label='medication_details'>
                            {item.medication_details}
                          </td>

                          <td data-label='status'>{item.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!patients?.prescriptions_patient?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/patients/patients-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

PatientsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_PATIENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default PatientsView;
