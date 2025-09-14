import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../components/Sidebar';

afterEach(cleanup);

describe('Sidebar component', () => {
  let props;

  beforeEach(() => {
    props = {
      name: '',
      setName: jest.fn(),
      description: '',
      setDescription: jest.fn(),
      cost: '',
      setCost: jest.fn(),
      level: '',
      setLevel: jest.fn(),
      search: '',
      setSearch: jest.fn(),
      addSkill: jest.fn((e) => e.preventDefault()),
      clearStorage: jest.fn(),
    };
  });

  it('renders all input fields and buttons', () => {
    render(<Sidebar {...props} />);
    expect(screen.getByLabelText(/Skill name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skill description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skill cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skill level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search skill/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Node/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Clear Storage/i })
    ).toBeInTheDocument();
  });

  it('disables Add Node when name & description empty', () => {
    render(<Sidebar {...props} />);
    expect(screen.getByRole('button', { name: /Add Node/i })).toBeDisabled();
  });

  it('disables Add Node when only name filled', () => {
    render(<Sidebar {...props} name="React" />);
    expect(screen.getByRole('button', { name: /Add Node/i })).toBeDisabled();
  });

  it('enables Add Node when name & description filled', () => {
    render(<Sidebar {...props} name="React" description="JS library" />);
    expect(
      screen.getByRole('button', { name: /Add Node/i })
    ).not.toBeDisabled();
  });

  it('calls setter functions on input changes', () => {
    render(<Sidebar {...props} />);
    fireEvent.change(screen.getByLabelText(/Skill name/i), {
      target: { value: 'Redux' },
    });
    expect(props.setName).toHaveBeenCalledWith('Redux');

    fireEvent.change(screen.getByLabelText(/Skill description/i), {
      target: { value: 'State mgmt' },
    });
    expect(props.setDescription).toHaveBeenCalledWith('State mgmt');

    fireEvent.change(screen.getByLabelText(/Skill cost/i), {
      target: { value: '5' },
    });
    expect(props.setCost).toHaveBeenCalledWith('5');

    fireEvent.change(screen.getByLabelText(/Skill level/i), {
      target: { value: '3' },
    });
    expect(props.setLevel).toHaveBeenCalledWith('3');

    fireEvent.change(screen.getByLabelText(/Search skill/i), {
      target: { value: 'vue' },
    });
    expect(props.setSearch).toHaveBeenCalledWith('vue');
  });

  it('calls addSkill on form submit', () => {
    render(<Sidebar {...props} name="React" description="Library" />);
    const addBtn = screen.getByRole('button', { name: /Add Node/i });
    fireEvent.submit(addBtn.closest('form'));
    expect(props.addSkill).toHaveBeenCalled();
  });

  it('calls clearStorage when Clear Storage button is clicked', () => {
    render(<Sidebar {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /Clear Storage/i }));
    expect(props.clearStorage).toHaveBeenCalled();
  });
});
