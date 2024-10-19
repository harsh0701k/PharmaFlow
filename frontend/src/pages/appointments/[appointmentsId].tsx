import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/appointments/appointmentsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditAppointments = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    patient: '',

    doctor: '',

    appointment_date: new Date(),

    location: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { appointments } = useAppSelector((state) => state.appointments);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { appointmentsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: appointmentsId }));
  }, [appointmentsId]);

  useEffect(() => {
    if (typeof appointments === 'object') {
      setInitialValues(appointments);
    }
  }, [appointments]);

  useEffect(() => {
    if (typeof appointments === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = appointments[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [appointments]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: appointmentsId, data }));
    await router.push('/appointments/appointments-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit appointments')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit appointments'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Patient' labelFor='patient'>
                <Field
                  name='patient'
                  id='patient'
                  component={SelectField}
                  options={initialValues.patient}
                  itemRef={'patients'}
                  showField={'first_name'}
                ></Field>
              </FormField>

              <FormField label='Doctor' labelFor='doctor'>
                <Field
                  name='doctor'
                  id='doctor'
                  component={SelectField}
                  options={initialValues.doctor}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='AppointmentDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.appointment_date
                      ? new Date(
                          dayjs(initialValues.appointment_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      appointment_date: date,
                    })
                  }
                />
              </FormField>

              <FormField label='Location'>
                <Field name='location' placeholder='Location' />
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organization'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/appointments/appointments-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditAppointments.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_APPOINTMENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditAppointments;
